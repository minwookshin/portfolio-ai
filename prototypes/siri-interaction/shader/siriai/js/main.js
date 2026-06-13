/**
 * [INPUT]: 依赖 ./renderer.js 的 SiriRenderer、./audio-analyzer.js 的 AudioAnalyzer、
 *          ./state.js 的 createSiriState、./spring.js 的 Spring、./ask-flow.js 的 createAskFlow
 * [OUTPUT]: 应用入口 — 纯宿主装配：问答旅程交给 ask-flow，本文件管指针（点击/长按语音/拖拽）、
 *           背景切换、提示文案、浮层位移、RAF 循环、清理
 * [POS]: js/ 的组装层；唯一接触页面级 DOM 的文件（旅程内 DOM 由 ask-flow 接管）
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

// ============================================================================
// Interaction flow:
//   click the orb     → ask-flow opens the glass pill (input + glass chips)
//   HOLD the orb      → listening: the wave goes live on the microphone for
//                       as long as the press lasts (voice visual, no STT)
//   Enter / tap chip  → ask-flow: thinking → first-token burst → paced reveal
//   click the pill    → follow-up; click outside / Esc → fold back to idle
// Drag the orb anywhere; it stays where dropped. ?demoAudio still drives the
// wave with fake bands for visual demos.
// ============================================================================

import { SiriRenderer } from './renderer.js';
import { AudioAnalyzer } from './audio-analyzer.js';
import { createSiriState } from './state.js';
import { Spring } from './spring.js';
import { createAskFlow } from './ask-flow.js';

const HINTS = {
	idle: 'Click to ask · hold to speak',
	ask: 'Enter to send · Esc to close',
	thinking: 'Thinking…',
	reply: '',
};
const HINT_LISTENING = 'Listening…';

const canvas = document.querySelector('#siri27-canvas');
const hint = document.querySelector('#siri-hint');
const micStatus = document.querySelector('#mic-status');
const pillOverlay = document.querySelector('#pill-overlay');

canvas.addEventListener('siri-render-error', (event) => {
	micStatus.textContent = event.detail?.message || 'WebGL renderer failed.';
});

// ?wave=classic restores the original xiaolin.work thin-line tuning;
// default is the lush "bloom" preset (aaaa-zhen's siriWaveCore IR values)
const wavePreset = new URLSearchParams(window.location.search).get('wave') || 'bloom';
const renderer = new SiriRenderer(canvas, { wavePreset });
const audio = new AudioAnalyzer();
const siri = createSiriState();

let rafId = 0;
let prevTimestamp = 0;

if (renderer.error) micStatus.textContent = renderer.error.message;

function setHint(text) {
	if (hint) hint.textContent = text;
}

// the journey core — shared with the z1 homepage embed (SiriOrb.tsx)
const flow = createAskFlow({
	siri,
	renderer,
	dom: {
		panel: document.querySelector('#ask-panel'),
		form: document.querySelector('#ask-form'),
		input: document.querySelector('#ask-input'),
		chips: document.querySelector('#ask-chips'),
		card: document.querySelector('#answer-card'),
		text: document.querySelector('#answer-text'),
	},
	onMode: (mode) => setHint(HINTS[mode]),
});

// ---------------------------------------------------------------------------
// backdrop: a wallpaper (async, cached) or a solid — the dots up top.
// Solids are 1x1 canvases fed through the same texture path; the cover-fit
// sampler turns a single pixel into a uniform field, so no renderer changes.
// Adding a wallpaper = one PHOTO_BACKDROPS entry + one dot in index.html.
// ---------------------------------------------------------------------------

function solidSource(color) {
	const tile = document.createElement('canvas');
	tile.width = 1;
	tile.height = 1;
	const ctx = tile.getContext('2d');
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	return tile;
}

const SOLID_BACKDROPS = { white: solidSource('#ffffff'), black: solidSource('#000000') };
// module-relative so the page works at any mount path (with or without a
// trailing slash) — document-relative './assets/…' would break under rewrites
const PHOTO_BACKDROPS = {
	tahoe: new URL('../assets/tahoe-beach-day.jpg', import.meta.url).href,
	sonoma: new URL('../assets/sonoma-horizon.jpg', import.meta.url).href,
};
const backdropButtons = document.querySelectorAll('.backdrops button');
const photoCache = new Map();
let backdrop = 'tahoe';

function loadPhoto(mode) {
	const image = new Image();
	let applied = false;
	function apply() {
		if (applied) return;
		applied = true;
		photoCache.set(mode, image);
		if (backdrop === mode) renderer.setBackgroundImage(image);
	}
	image.decoding = 'async';
	image.addEventListener('load', apply, { once: true });
	image.addEventListener(
		'error',
		() => {
			micStatus.textContent = 'Background image failed to load; using fallback.';
		},
		{ once: true },
	);
	image.src = PHOTO_BACKDROPS[mode];
	if (typeof image.decode === 'function') image.decode().then(apply).catch(() => {});
}

function setBackdrop(mode) {
	backdrop = mode;
	for (const button of backdropButtons) {
		button.setAttribute('aria-pressed', String(button.dataset.backdrop === mode));
	}
	if (SOLID_BACKDROPS[mode]) {
		renderer.setBackgroundImage(SOLID_BACKDROPS[mode]);
		return;
	}
	const cached = photoCache.get(mode);
	if (cached) renderer.setBackgroundImage(cached);
	else loadPhoto(mode);
}

for (const button of backdropButtons) {
	button.addEventListener('click', () => setBackdrop(button.dataset.backdrop));
}

window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && flow.mode !== 'idle') flow.close();
});

// ---------------------------------------------------------------------------
// frame loop
// ---------------------------------------------------------------------------

function renderFrame(bands, dt = 0) {
	renderer.render({ surface: siri.surface, progress: siri.progress, bands, sizes: siri.sizes, dt });
}

function frame(now) {
	const dt = prevTimestamp ? Math.min((now - prevTimestamp) / 1000, 0.1) : 0;
	prevTimestamp = now;
	renderer.panelOffset = [dragX.step(dt) * renderer.dpr, dragY.step(dt) * renderer.dpr];
	pillOverlay.style.transform = `translate(calc(-50% + ${dragX.value}px), calc(-50% + ${dragY.value}px))`;
	flow.tick(dt);
	const bands = audio.update(dt);
	siri.tick(dt, bands);
	renderFrame(bands, dt);
	rafId = requestAnimationFrame(frame);
}

// ---------------------------------------------------------------------------
// pointer interaction: click the orb to ask, HOLD it to speak (the wave goes
// live on the mic until release), drag it to move (a press that travels
// > 6px is a drag, not a click). Clicks outside the glass close whatever is
// open; clicking the answer pill asks a follow-up.
// ---------------------------------------------------------------------------

const DRAG_SPRING = { response: 0.3, dampingRatio: 0.85 };
const EDGE_KEEP_PX = 100; // keep the ball center this far inside the viewport
const CLICK_SLOP_PX = 6;
const LONG_PRESS_MS = 450; // press held this long without moving = voice hold

const dragX = new Spring(0, DRAG_SPRING);
const dragY = new Spring(0, DRAG_SPRING);
let dragging = false;
let pressedInside = false;
let moved = false;
let grabPointer = [0, 0];
let grabOffset = [0, 0];
let longPressTimer = 0;
let voiceHold = false;

// voice hold: the listening wave rides the mic for the duration of the press.
// Visual only — no speech-to-text; release folds straight back to idle.
function startVoiceHold() {
	longPressTimer = 0;
	if (!dragging || moved || flow.mode !== 'idle') return;
	voiceHold = true;
	siri.select('listening');
	setHint(HINT_LISTENING);
	micStatus.textContent = 'Listening.';
	audio.start().catch(() => {
		micStatus.textContent = 'Microphone unavailable — wave runs silent.';
	});
}

function endVoiceHold() {
	if (!voiceHold) return;
	voiceHold = false;
	audio.stop();
	siri.select('idle');
	setHint(HINTS.idle);
	micStatus.textContent = 'Idle.';
}

function clampedOffset(x, y) {
	const maxX = Math.max(0, window.innerWidth * 0.5 - EDGE_KEEP_PX);
	const maxY = Math.max(0, window.innerHeight * 0.5 - EDGE_KEEP_PX);
	return [Math.min(maxX, Math.max(-maxX, x)), Math.min(maxY, Math.max(-maxY, y))];
}

// hit area follows the morph: circle when idle, pill rect when open. The
// grab pad serves the small orb only — it fades with the morph, so clicks
// that LOOK outside the open pill actually count as outside and close it.
function hitGlass(clientX, clientY) {
	const ballX = window.innerWidth * 0.5 + dragX.target;
	const ballY = window.innerHeight * 0.5 + dragY.target;
	const morph = Math.max(0, Math.min(1, siri.surface.answer));
	const pad = 26 * (1 - morph);
	const base = siri.sizes.expanded.width;
	const pillW = Math.min(siri.sizes.answer.width, window.innerWidth - 48);
	const halfW = (base + (pillW - base) * morph) * 0.5 + pad;
	const halfH = (base + (siri.sizes.answer.height - base) * morph) * 0.5 + pad;
	return Math.abs(clientX - ballX) <= halfW && Math.abs(clientY - ballY) <= halfH;
}

function onPointerDown(event) {
	canvas.setPointerCapture(event.pointerId);
	moved = false;
	pressedInside = hitGlass(event.clientX, event.clientY);
	grabPointer = [event.clientX, event.clientY];
	grabOffset = [dragX.target, dragY.target];
	if (pressedInside) {
		dragging = true;
		siri.setPressed(true);
		if (flow.mode === 'idle') longPressTimer = window.setTimeout(startVoiceHold, LONG_PRESS_MS);
	}
}

function onPointerMove(event) {
	if (!dragging) return;
	const dx = event.clientX - grabPointer[0];
	const dy = event.clientY - grabPointer[1];
	if (!moved && Math.hypot(dx, dy) > CLICK_SLOP_PX) {
		moved = true;
		// travelled before the hold fired → it's a drag, not a voice press
		window.clearTimeout(longPressTimer);
		longPressTimer = 0;
	}
	if (!moved) return;
	const [x, y] = clampedOffset(grabOffset[0] + dx, grabOffset[1] + dy);
	dragX.setTarget(x);
	dragY.setTarget(y);
}

function onRelease(event) {
	const wasDragging = dragging;
	dragging = false;
	siri.setPressed(false);
	window.clearTimeout(longPressTimer);
	longPressTimer = 0;
	const wasVoice = voiceHold;
	endVoiceHold();
	if (!event || event.type !== 'pointerup') return;
	if (wasVoice) return; // a voice press, not a click
	if (wasDragging && moved) return; // a drag, not a click

	if (pressedInside) {
		// click ON the glass: idle → ask; reply → follow-up; thinking → cancel
		if (flow.mode === 'idle' || flow.mode === 'reply') flow.openAsk();
		else if (flow.mode === 'thinking') flow.close();
	} else if (flow.mode !== 'idle') {
		flow.close(); // click outside folds everything back
	}
}

canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onRelease);
canvas.addEventListener('pointercancel', onRelease);
canvas.addEventListener('lostpointercapture', onRelease);

// ---------------------------------------------------------------------------
// boot
// ---------------------------------------------------------------------------

siri.select('idle');
setHint(HINTS.idle);
const initialBands = audio.update(0);
siri.tick(0, initialBands);
renderFrame(initialBands);
setBackdrop(backdrop);
audio.prepare(); // pre-warm the worklet so the voice hold starts instantly
rafId = requestAnimationFrame(frame);

// dev hook: drive states from the console, e.g. __siri.flow.openAsk()
window.__siri = { siri, renderer, audio, flow };

window.addEventListener(
	'pagehide',
	() => {
		flow.dispose();
		audio.stop({ closeContext: true });
		cancelAnimationFrame(rafId);
		renderer.dispose();
	},
	{ once: true },
);
