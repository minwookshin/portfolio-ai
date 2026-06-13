/**
 * [INPUT]: 依赖 ./spring.js 的 Spring；POST apiUrl（流式纯文本回答）；
 *          消费 renderer 的 canvas/width/dpr/panelOffset/chipLenses 与 siri 状态机
 * [OUTPUT]: createAskFlow() — 问答旅程的共享核心：模式机（idle/ask/thinking/reply）、
 *           流式问答 + 步调凝出（blur-dissolve）、回答动态高度（封顶正方形 + 滚动渐隐）、
 *           chip 透镜喂养（DOM 矩形 → renderer.chipLenses，处理任意宿主缩放）
 * [POS]: js/ 的旅程中枢，被独立页 main.js 与 z1 首页 SiriOrb.tsx 共同消费——
 *        同构逻辑的单一真相源。宿主只负责指针/语音/拖拽/提示/浮层位移
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

// ============================================================================
// The ask journey, host-agnostic:
//   openAsk()  → glass pill with input + suggestion chips
//   ask(q)     → pill folds to the orb, dots think; the FIRST streamed token
//                fires the gather-burst finale, then the pill reopens and the
//                answer condenses in through the pacer
//   close()    → fold back to idle
//   tick(dt)   → per-frame feeds: chip lenses + dynamic answer height
// Geometry is derived from renderer.canvas's client rect vs its device size,
// so the same math serves a fullscreen page and a CSS-scaled deck card.
// ============================================================================

import { Spring } from './spring.js';

const MIN_THINK_MS = 1400; // let the dots dance before the burst
const HISTORY_LIMIT = 6; // messages of context sent to the model
const PILL_MIN_H = 150; // resting pill height (state.js sizes.answer.height)
const ANSWER_PAD_V = 23; // text inset inside the pill, top and bottom
const FADE_PX = 24; // scroll fade depth
const REVEAL_TICK_MS = 70; // paced-reveal cadence

export function createAskFlow({ siri, renderer, dom, classes = {}, apiUrl = '/api/siri', onMode }) {
	const { panel, form, input, chips, card, text } = dom;
	const onClass = classes.on || 'on';
	const revealClass = classes.reveal || 'reveal';

	let mode = 'idle';
	const history = []; // {role, content} — conversational context for follow-ups
	let streamAbort = null;
	let pending = '';
	let revealTimer = 0;
	let streamEnded = false;
	const cleanups = [];

	function setMode(next) {
		mode = next;
		panel.classList.toggle(onClass, next === 'ask');
		card.classList.toggle(onClass, next === 'reply');
		if (onMode) onMode(next);
	}

	// ── paced reveal: arrival and display are decoupled. Network chunks fill
	// `pending`; every tick a few segments (words / short CJK runs) enter the
	// DOM as blur-dissolving spans. Bite size grows with backlog, so fast
	// models read as line-by-line flow and slow ones lose their stiffness. ──

	function appendReveal(part) {
		const span = document.createElement('span');
		span.className = revealClass;
		span.textContent = part;
		text.appendChild(span);
		card.scrollTop = card.scrollHeight; // follow the writing point
	}

	function stopReveal() {
		window.clearInterval(revealTimer);
		revealTimer = 0;
	}

	function drainTick() {
		if (!pending) {
			if (streamEnded) stopReveal();
			return;
		}
		const segments = pending.length > 240 ? 8 : pending.length > 90 ? 4 : 2;
		let take = '';
		for (let i = 0; i < segments && pending; i += 1) {
			const m = pending.match(/^\s*(?:[　-鿿가-힯]{1,4}|\S+)\s*/);
			if (!m) break;
			take += m[0];
			pending = pending.slice(m[0].length);
		}
		if (take) appendReveal(take);
	}

	function startReveal() {
		if (!revealTimer) revealTimer = window.setInterval(drainTick, REVEAL_TICK_MS);
	}

	function cancelStream() {
		if (streamAbort) streamAbort.abort();
		streamAbort = null;
		stopReveal();
		pending = '';
		streamEnded = false;
	}

	// ── journey verbs ──────────────────────────────────────────────────────

	function openAsk() {
		cancelStream();
		siri.select('answer');
		setMode('ask');
		input.value = '';
		// focus once the morph is underway, so the caret appears inside the pill
		window.setTimeout(() => input.focus({ preventScroll: true }), 220);
	}

	function close() {
		cancelStream();
		siri.select('idle');
		setMode('idle');
		input.blur();
	}

	async function ask(question) {
		cancelStream();
		const controller = new AbortController();
		streamAbort = controller;
		const startedAt = performance.now();

		history.push({ role: 'user', content: question });
		siri.select('thinking');
		setMode('thinking');
		text.textContent = '';

		// the first token fires the gather-burst finale; everything after
		// flows through the pacer into the reopened pill
		const reveal = async () => {
			const wait = Math.max(0, MIN_THINK_MS - (performance.now() - startedAt));
			if (wait > 0) await new Promise((r) => window.setTimeout(r, wait));
			if (controller.signal.aborted) return false;
			const burstDelay = siri.conclude();
			await new Promise((r) => window.setTimeout(r, burstDelay));
			if (controller.signal.aborted) return false;
			siri.select('answer');
			setMode('reply');
			return true;
		};

		try {
			const res = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: history.slice(-HISTORY_LIMIT) }),
				signal: controller.signal,
			});
			if (!res.ok || !res.body) throw new Error(res.status === 429 ? 'slow down a little ✋' : 'no answer right now');

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let answer = '';
			let revealed = false;
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				if (!chunk) continue;
				answer += chunk;
				if (!revealed) {
					revealed = await reveal();
					if (!revealed) return; // aborted mid-flight
					startReveal();
				}
				pending += chunk; // every chunk flows through the pacer, fast or slow
			}
			streamEnded = true; // the pacer drains the tail, then stops itself
			if (!answer.trim()) throw new Error('no answer right now');
			history.push({ role: 'assistant', content: answer });
		} catch (error) {
			if (controller.signal.aborted) return;
			const message = error instanceof Error ? error.message : 'no answer right now';
			stopReveal();
			pending = '';
			if (await reveal()) {
				text.textContent = '';
				appendReveal(message);
			}
			history.pop(); // failed turn doesn't pollute context
		} finally {
			if (streamAbort === controller) streamAbort = null;
		}
	}

	// ── built-in DOM wiring: submit, chips, follow-up click, scroll fades ──

	function listen(target, type, handler) {
		target.addEventListener(type, handler);
		cleanups.push(() => target.removeEventListener(type, handler));
	}

	listen(form, 'submit', (event) => {
		event.preventDefault();
		const question = input.value.trim();
		if (!question) return;
		input.blur();
		ask(question);
	});

	// clicking the streamed text asks a follow-up (same gesture as the pill)
	listen(card, 'click', () => {
		if (mode === 'reply') openAsk();
	});

	const chipButtons = [...chips.querySelectorAll('button')];
	const chipHoverSprings = chipButtons.map(() => new Spring(0, { response: 0.25, dampingRatio: 1 }));
	chipButtons.forEach((chip, i) => {
		listen(chip, 'click', () => ask((chip.textContent || '').trim()));
		listen(chip, 'pointerenter', () => chipHoverSprings[i].setTarget(1));
		listen(chip, 'pointerleave', () => chipHoverSprings[i].setTarget(0));
	});

	function updateFades() {
		const overflow = card.scrollHeight - card.clientHeight;
		const top = Math.max(0, Math.min(FADE_PX, card.scrollTop));
		const bottom = Math.max(0, Math.min(FADE_PX, overflow - card.scrollTop));
		card.style.setProperty('--fade-top', `${top}px`);
		card.style.setProperty('--fade-bottom', `${bottom}px`);
	}
	listen(card, 'scroll', updateFades);

	// ── per-frame feeds ────────────────────────────────────────────────────

	// chip lenses: DOM buttons carry text + hit area; their glass body is
	// rendered by the glass pass. Client px ↔ device px conversion comes from
	// the canvas rect, so deck scaling and DPR are both absorbed.
	const chipVisSpring = new Spring(0, { response: 0.4, dampingRatio: 1 });
	function feedChipLenses(dt) {
		chipVisSpring.setTarget(mode === 'ask' ? 1 : 0);
		const vis = chipVisSpring.step(dt);
		if (vis <= 0.001) {
			renderer.chipLenses.states = [0, 0, 0];
			return;
		}
		const rect = renderer.canvas.getBoundingClientRect();
		if (!rect.width || !renderer.width) return;
		const clientPerDevice = rect.width / renderer.width;
		const panelX = rect.left + rect.width * 0.5 + renderer.panelOffset[0] * clientPerDevice;
		const panelY = rect.top + rect.height * 0.5 + renderer.panelOffset[1] * clientPerDevice;
		renderer.chipLenses.states = [vis, vis, vis];
		renderer.chipLenses.hovers = chipHoverSprings.map((spring) => spring.step(dt));
		renderer.chipLenses.rects = chipButtons.map((chip) => {
			const r = chip.getBoundingClientRect();
			return [
				(r.left + r.width * 0.5 - panelX) / clientPerDevice,
				(r.top + r.height * 0.5 - panelY) / clientPerDevice,
				(r.width * 0.5) / clientPerDevice,
				(r.height * 0.5) / clientPerDevice,
			];
		});
	}

	// answer pill height: rides a spring on the card's content height while
	// the text streams in, capped at a square (height ≤ effective width)
	const pillHeightSpring = new Spring(PILL_MIN_H, { response: 0.45, dampingRatio: 0.9 });
	function feedAnswerHeight(dt) {
		const canvasCssWidth = renderer.width / Math.max(renderer.dpr, 0.001);
		const squareCap = Math.min(siri.sizes.answer.width, canvasCssWidth - 48);
		const target =
			mode === 'reply'
				? Math.min(Math.max(card.scrollHeight + ANSWER_PAD_V * 2, PILL_MIN_H), squareCap)
				: PILL_MIN_H;
		pillHeightSpring.setTarget(target);
		const h = pillHeightSpring.step(dt);
		siri.sizes.answer.height = h;
		card.style.setProperty('--answer-max', `${Math.round(h - ANSWER_PAD_V * 2)}px`);
		if (mode === 'reply') updateFades();
	}

	setMode('idle');

	return {
		get mode() {
			return mode;
		},
		openAsk,
		close,
		ask,
		tick(dt) {
			feedChipLenses(dt);
			feedAnswerHeight(dt);
		},
		dispose() {
			cancelStream();
			for (const fn of cleanups) fn();
			cleanups.length = 0;
		},
	};
}
