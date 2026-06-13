/**
 * [INPUT]: 依赖 ./spring.js 的 Spring；依赖同目录 audio-worklet.js（AudioWorklet 模块，运行时加载）
 * [OUTPUT]: AudioAnalyzer 类 — 麦克风 → {low, mid, high} 三频段（0..1，AGC 归一 + 弹簧平滑）
 * [POS]: js/ 的音频驱动源；listening 态喂给 wave shader 的 uLow/uMid/uHigh 由此而来
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

// ============================================================================
// Microphone band analyzer.
//   Preferred path : AudioWorklet (audio-worklet.js, off-main-thread FFT)
//   Fallback path  : ScriptProcessor + the same hand-rolled radix-2 FFT here
//   Demo path      : ?demoAudio — three phase-shifted sines, no mic needed
// Bands: low < 500 Hz < mid < 3 kHz < high. Each raw band runs through an
// AGC (rolling peak with decay, pow 0.7 loudness curve), then a spring.
// ============================================================================

import { Spring } from './spring.js';

const FFT_SIZE = 1024;
const FFT_HALF = FFT_SIZE / 2;
const SCRIPT_PROCESSOR_SIZE = 512;
const SPECTRUM_HOP_SIZE = 512;
const SPECTRUM_COOLDOWN_S = 1 / 60;
const BAND_SPRING = { response: 0.2, dampingRatio: 1 };
const LOW_MID_SPLIT_HZ = 500;
const MID_HIGH_SPLIT_HZ = 3000;
const PEAK_FLOOR = 8e-4;
const PEAK_DECAY = 0.9975;
const WORKLET_URL = new URL('./audio-worklet.js', import.meta.url);

function clamp01(value) {
	return Math.max(0, Math.min(1, value));
}

function makeHanningWindow() {
	const values = new Float32Array(FFT_SIZE);
	for (let i = 0; i < FFT_SIZE; i += 1) {
		values[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1));
	}
	return values;
}

function makeBitReverseTable() {
	const table = new Uint16Array(FFT_SIZE);
	const bits = Math.log2(FFT_SIZE);
	for (let i = 0; i < FFT_SIZE; i += 1) {
		let value = i;
		let reversed = 0;
		for (let bit = 0; bit < bits; bit += 1) {
			reversed = (reversed << 1) | (value & 1);
			value >>= 1;
		}
		table[i] = reversed;
	}
	return table;
}

export class AudioAnalyzer {
	constructor() {
		this.low = 0;
		this.mid = 0;
		this.high = 0;
		this._rawLow = 0;
		this._rawMid = 0;
		this._rawHigh = 0;
		this._lowSpring = new Spring(0, BAND_SPRING);
		this._midSpring = new Spring(0, BAND_SPRING);
		this._highSpring = new Spring(0, BAND_SPRING);
		this._peakLow = 0.001;
		this._peakMid = 0.001;
		this._peakHigh = 0.001;
		this._context = null;
		this._source = null;
		this._workletNode = null;
		this._processor = null;
		this._silentGain = null;
		this._stream = null;
		this._preparePromise = null;
		this._workletModuleReady = false;
		this._destinationConnected = false;
		this._sampleRate = 48000;
		this._ring = new Float32Array(FFT_SIZE);
		this._real = new Float32Array(FFT_SIZE);
		this._imag = new Float32Array(FFT_SIZE);
		this._mags = new Float32Array(FFT_HALF);
		this._window = makeHanningWindow();
		this._bitReverse = makeBitReverseTable();
		this._ringWrite = 0;
		this._pendingSamples = 0;
		this._spectrumCooldown = 0;
		this._demoAudio = new URLSearchParams(window.location.search).has('demoAudio');
		this._demoTime = 0;
		this.running = false;
	}

	// Pre-warm the AudioContext + worklet module during idle time so the
	// mic start after the press → listening transition is instant.
	async prepare() {
		if (this._demoAudio || this._preparePromise || this._workletModuleReady) return this._preparePromise;
		if (!this._supportsWorklet()) return null;
		this._preparePromise = (async () => {
			try {
				this._ensureAudioContext();
				await this._ensureWorkletModule();
			} catch {
				this._workletModuleReady = false;
			}
		})();
		try {
			await this._preparePromise;
		} finally {
			this._preparePromise = null;
		}
		return null;
	}

	async start() {
		if (this.running) return;
		if (this._demoAudio) {
			this.running = true;
			return;
		}
		if (!navigator.mediaDevices?.getUserMedia) {
			throw new Error('Microphone is not available in this browser.');
		}
		this._stream = await navigator.mediaDevices.getUserMedia({
			audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
		});
		if (this._preparePromise) await this._preparePromise;
		const ContextClass = window.AudioContext || window.webkitAudioContext;
		this._ensureAudioContext(ContextClass);
		this._source = this._context.createMediaStreamSource(this._stream);
		await this._connectAnalysisNode();
		this._connectDestination();
		if (this._context.state === 'suspended') await this._context.resume();
		this.running = true;
	}

	stop({ closeContext = false } = {}) {
		if (this._workletNode) this._workletNode.port.onmessage = null;
		if (this._processor) this._processor.onaudioprocess = null;
		if (this._source) this._source.disconnect();
		if (this._workletNode) this._workletNode.disconnect();
		if (this._processor) this._processor.disconnect();
		if (this._silentGain) {
			this._silentGain.disconnect();
			this._destinationConnected = false;
		}
		if (this._stream) {
			for (const track of this._stream.getTracks()) track.stop();
		}
		if (closeContext) {
			if (this._context?.state !== 'closed') this._context?.close();
			this._context = null;
			this._silentGain = null;
			this._workletModuleReady = false;
			this._destinationConnected = false;
		}
		this._source = null;
		this._workletNode = null;
		this._processor = null;
		this._stream = null;
		this.running = false;
		this.low = 0;
		this.mid = 0;
		this.high = 0;
		this._rawLow = 0;
		this._rawMid = 0;
		this._rawHigh = 0;
		this._lowSpring.jump(0);
		this._midSpring.jump(0);
		this._highSpring.jump(0);
		this._peakLow = 0.001;
		this._peakMid = 0.001;
		this._peakHigh = 0.001;
		this._ring.fill(0);
		this._ringWrite = 0;
		this._pendingSamples = 0;
		this._spectrumCooldown = 0;
		this._demoTime = 0;
	}

	update(dt) {
		if (this.running && this._demoAudio) {
			this._demoTime += dt;
			this._rawLow = clamp01(0.44 + 0.34 * Math.sin(this._demoTime * 3.1));
			this._rawMid = clamp01(0.34 + 0.3 * Math.sin(this._demoTime * 4.7 + 1.7));
			this._rawHigh = clamp01(0.26 + 0.32 * Math.sin(this._demoTime * 8.4 + 0.9));
		} else if (this.running && !this._workletNode) {
			this._maybeComputeSpectrum(dt);
		}
		this._lowSpring.setTarget(this._rawLow);
		this._midSpring.setTarget(this._rawMid);
		this._highSpring.setTarget(this._rawHigh);
		this.low = this._lowSpring.step(dt);
		this.mid = this._midSpring.step(dt);
		this.high = this._highSpring.step(dt);
		return { low: this.low, mid: this.mid, high: this.high };
	}

	_supportsWorklet() {
		return !!((window.AudioContext || window.webkitAudioContext) && window.AudioWorkletNode);
	}

	_ensureAudioContext(ContextClass = window.AudioContext || window.webkitAudioContext) {
		if (this._context && this._context.state !== 'closed') return;
		this._context = new ContextClass({ latencyHint: 'interactive' });
		this._sampleRate = this._context.sampleRate;
		this._silentGain = this._context.createGain();
		this._silentGain.gain.value = 0;
		this._workletModuleReady = false;
		this._destinationConnected = false;
	}

	async _ensureWorkletModule() {
		if (this._workletModuleReady) return true;
		if (!this._context.audioWorklet || typeof AudioWorkletNode === 'undefined') return false;
		await this._context.audioWorklet.addModule(WORKLET_URL);
		this._workletModuleReady = true;
		return true;
	}

	// A zero-gain node keeps the audio graph "audible" so browsers do not
	// throttle the worklet, without actually emitting sound.
	_connectDestination() {
		if (this._destinationConnected) return;
		this._silentGain.connect(this._context.destination);
		this._destinationConnected = true;
	}

	async _connectAnalysisNode() {
		if (this._supportsWorklet()) {
			try {
				await this._ensureWorkletModule();
				this._workletNode = new AudioWorkletNode(this._context, 'siri-bands-processor');
				this._workletNode.port.onmessage = (event) => {
					const { low, mid, high } = event.data || {};
					if (Number.isFinite(low)) this._rawLow = clamp01(low);
					if (Number.isFinite(mid)) this._rawMid = clamp01(mid);
					if (Number.isFinite(high)) this._rawHigh = clamp01(high);
				};
				this._source.connect(this._workletNode);
				this._workletNode.connect(this._silentGain);
				return;
			} catch {
				this._workletNode = null;
			}
		}
		this._processor = this._context.createScriptProcessor(SCRIPT_PROCESSOR_SIZE, 1, 1);
		this._processor.onaudioprocess = (event) => this._process(event);
		this._source.connect(this._processor);
		this._processor.connect(this._silentGain);
	}

	_process(event) {
		const input = event.inputBuffer.getChannelData(0);
		event.outputBuffer.getChannelData(0).fill(0);
		for (let i = 0; i < input.length; i += 1) {
			this._ring[this._ringWrite] = input[i];
			this._ringWrite = (this._ringWrite + 1) & (FFT_SIZE - 1);
		}
		this._pendingSamples += input.length;
	}

	_maybeComputeSpectrum(dt) {
		this._spectrumCooldown = Math.max(0, this._spectrumCooldown - dt);
		if (this._pendingSamples < SPECTRUM_HOP_SIZE || this._spectrumCooldown > 0) return;
		this._pendingSamples = 0;
		this._spectrumCooldown = SPECTRUM_COOLDOWN_S;
		this._computeSpectrum();
	}

	_computeSpectrum() {
		// unroll the ring buffer into chronological order, windowed
		const headLength = FFT_SIZE - this._ringWrite;
		for (let i = 0; i < headLength; i += 1) {
			this._real[i] = this._ring[this._ringWrite + i] * this._window[i];
			this._imag[i] = 0;
		}
		for (let i = 0; i < this._ringWrite; i += 1) {
			const j = headLength + i;
			this._real[j] = this._ring[i] * this._window[j];
			this._imag[j] = 0;
		}
		this._fft(this._real, this._imag);
		const norm = 1 / FFT_SIZE;
		for (let i = 0; i < FFT_HALF; i += 1) {
			this._mags[i] = Math.hypot(this._real[i], this._imag[i]) * norm;
		}
		this._rawLow = this._agc(this._bandRms(20, LOW_MID_SPLIT_HZ), 'Low');
		this._rawMid = this._agc(this._bandRms(LOW_MID_SPLIT_HZ, MID_HIGH_SPLIT_HZ), 'Mid');
		this._rawHigh = this._agc(this._bandRms(MID_HIGH_SPLIT_HZ, this._sampleRate * 0.5), 'High');
	}

	// in-place radix-2 Cooley-Tukey
	_fft(real, imag) {
		for (let i = 0; i < FFT_SIZE; i += 1) {
			const j = this._bitReverse[i];
			if (j <= i) continue;
			const tr = real[i];
			const ti = imag[i];
			real[i] = real[j];
			imag[i] = imag[j];
			real[j] = tr;
			imag[j] = ti;
		}
		for (let size = 2; size <= FFT_SIZE; size <<= 1) {
			const half = size >> 1;
			const angle = (-2 * Math.PI) / size;
			const stepR = Math.cos(angle);
			const stepI = Math.sin(angle);
			for (let start = 0; start < FFT_SIZE; start += size) {
				let wr = 1;
				let wi = 0;
				for (let offset = 0; offset < half; offset += 1) {
					const even = start + offset;
					const odd = even + half;
					const tr = wr * real[odd] - wi * imag[odd];
					const ti = wr * imag[odd] + wi * real[odd];
					real[odd] = real[even] - tr;
					imag[odd] = imag[even] - ti;
					real[even] += tr;
					imag[even] += ti;
					const nextWr = wr * stepR - wi * stepI;
					wi = wr * stepI + wi * stepR;
					wr = nextWr;
				}
			}
		}
	}

	_bandRms(lowHz, highHz) {
		const binHz = this._sampleRate / FFT_SIZE;
		const start = Math.max(1, Math.floor(lowHz / binHz));
		const end = Math.min(this._mags.length - 1, Math.ceil(highHz / binHz));
		if (end <= start) return 0;
		let sum = 0;
		for (let i = start; i <= end; i += 1) {
			sum += this._mags[i] * this._mags[i];
		}
		return Math.sqrt(sum / (end - start + 1));
	}

	// rolling-peak AGC: normalize against a slowly decaying per-band peak so
	// quiet and loud rooms produce comparable 0..1 drive
	_agc(raw, band) {
		const key = `_peak${band}`;
		this[key] = Math.max(raw, Math.max(PEAK_FLOOR, this[key] * PEAK_DECAY));
		return clamp01(Math.pow(raw / this[key], 0.7));
	}
}
