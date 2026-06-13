const VERTEX_SHADER = `#version 300 es
precision highp float;

out vec2 vUv;

void main() {
  vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = pos;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform vec2 uCssResolution;
uniform vec2 uOffset;
uniform float uDpr;
uniform float uTime;
uniform float uOpen;
uniform float uListening;
uniform float uThinking;
uniform int uBackdrop;

out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 spectrum(float x) {
  vec3 a = vec3(0.48, 0.55, 1.0);
  vec3 b = vec3(1.0, 0.36, 0.15);
  vec3 c = vec3(1.0, 0.93, 0.45);
  vec3 d = vec3(0.3, 1.0, 0.68);
  vec3 left = mix(a, b, smoothstep(0.12, 0.45, x));
  vec3 right = mix(c, d, smoothstep(0.55, 0.88, x));
  return mix(left, right, smoothstep(0.44, 0.62, x));
}

vec3 backdrop(vec2 p) {
  vec2 uv = p / max(uCssResolution, vec2(1.0));
  if (uBackdrop == 0) return vec3(0.985);
  if (uBackdrop == 2) {
    vec3 sky = mix(vec3(0.18, 0.55, 0.78), vec3(0.56, 0.85, 0.86), smoothstep(0.38, 0.66, uv.y));
    vec3 water = vec3(0.36, 0.78, 0.72);
    vec3 bg = mix(sky, water, smoothstep(0.58, 0.72, uv.y));
    bg += vec3(0.1, 0.22, 0.26) * (1.0 - smoothstep(0.15, 0.62, distance(uv, vec2(0.78, 0.52))));
    return bg;
  }
  if (uBackdrop == 3) {
    vec3 bg = mix(vec3(0.09, 0.05, 0.18), vec3(0.74, 0.32, 0.38), smoothstep(0.1, 0.98, uv.x + uv.y * 0.28));
    bg += vec3(0.44, 0.28, 0.95) * (1.0 - smoothstep(0.05, 0.52, distance(uv, vec2(0.28, 0.62))));
    bg += vec3(0.95, 0.48, 0.26) * (1.0 - smoothstep(0.04, 0.42, distance(uv, vec2(0.72, 0.36))));
    return bg;
  }
  return vec3(0.0);
}

vec4 drawGlass(vec2 p, vec2 center, vec3 bg) {
  float width = min(458.0, uCssResolution.x - 42.0);
  vec2 halfSize = mix(vec2(66.0), vec2(width * 0.5, 73.0), uOpen);
  float radius = mix(66.0, 73.0, uOpen);
  vec2 q = p - center;
  float d = sdRoundRect(q, halfSize, radius);
  float fill = smoothstep(1.4, -1.0, d);
  float edge = smoothstep(2.0, 0.0, abs(d));
  float halo = smoothstep(80.0, -12.0, d) * (1.0 - fill);
  float n = noise(q * 0.024 + uTime * 0.12);

  if (uOpen > 0.5) {
    vec3 tint = mix(vec3(0.01, 0.012, 0.016), bg * 0.42, 0.2);
    vec3 inner = tint + vec3(0.025, 0.028, 0.035) * n;
    inner += vec3(1.0) * smoothstep(-4.0, -16.0, q.y + halfSize.y * 0.72) * 0.025;
    vec3 border = mix(vec3(0.06), vec3(0.45), smoothstep(-halfSize.y, halfSize.y, -q.y));
    vec3 color = mix(bg, inner, fill * 0.58);
    color += border * edge * 0.28;
    color += vec3(0.16, 0.18, 0.2) * halo * 0.12;
    return vec4(color, 1.0);
  }

  float r = max(1.0, radius);
  vec2 uv = q / r;
  float mask = smoothstep(1.0, 0.985, length(uv));
  float waveA = exp(-abs(uv.y + 0.09 * sin(uv.x * 7.0 + uTime * 0.85)) * 17.0);
  float waveB = exp(-abs(uv.y - 0.18 + 0.045 * sin(uv.x * 12.0 - uTime * 1.1)) * 24.0);
  float bandMask = smoothstep(1.0, 0.22, abs(uv.x));
  float active = max(uListening, uThinking);
  vec3 body = mix(vec3(0.0), vec3(0.035, 0.04, 0.055), smoothstep(1.0, 0.0, length(uv)));
  body += vec3(0.98, 0.82, 0.52) * smoothstep(0.72, 0.0, distance(uv, vec2(-0.35, -0.42))) * 0.12;
  body += spectrum(uv.x * 0.5 + 0.5) * (waveA * 0.34 + waveB * 0.22) * bandMask * (0.75 + active * 0.55);
  body += vec3(0.85, 0.9, 1.0) * smoothstep(0.22, 0.0, abs(uv.y + 0.42 + uv.x * 0.12)) * smoothstep(0.88, 0.08, abs(uv.x)) * 0.08;
  body += vec3(0.18, 0.25, 1.0) * halo * 0.08;
  body += vec3(n * 0.025);
  vec3 color = mix(bg, body, mask);
  color += vec3(0.8, 0.86, 1.0) * edge * 0.22;
  color += vec3(0.22, 0.32, 1.0) * halo * 0.18;
  return vec4(color, 1.0);
}

vec3 drawThinkingDots(vec2 p, vec2 center, vec3 color) {
  float ring = 55.0;
  float spin = uTime * 2.6;
  for (int i = 0; i < 6; i++) {
    float a = spin + float(i) * 1.04719755;
    vec2 dot = center + vec2(cos(a), sin(a)) * ring;
    float d = length(p - dot);
    float m = smoothstep(9.0, 2.0, d);
    color += vec3(0.9, 0.95, 1.0) * m * (0.35 + 0.65 * uThinking);
  }
  return color;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x / uDpr, (uResolution.y - gl_FragCoord.y) / uDpr);
  vec3 bg = backdrop(p);
  vec2 uv = p / max(uCssResolution, vec2(1.0));
  float vignette = smoothstep(0.86, 0.2, distance(uv, vec2(0.5)));
  bg *= mix(0.72, 1.0, vignette);

  vec2 center = uCssResolution * 0.5 + uOffset;
  vec4 glass = drawGlass(p, center, bg);
  vec3 color = glass.rgb;
  color = drawThinkingDots(p, center, color);

  outColor = vec4(color, 1.0);
}
`;

const BACKDROPS = {
  white: 0,
  black: 1,
  tahoe: 2,
  sonoma: 3,
};

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Shader compile failed.";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Program link failed.";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

export class SiriRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx2d = null;
    this.gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    this.dpr = 1;
    this.width = 1;
    this.height = 1;
    this.cssWidth = 1;
    this.cssHeight = 1;
    this.backdrop = "black";
    this.mode = "idle";
    this.error = null;

    if (!this.gl) {
      this.ctx2d = canvas.getContext("2d");
      if (!this.ctx2d) this.error = new Error("Canvas rendering is not available in this browser.");
      return;
    }

    try {
      this.program = createProgram(this.gl);
      this.vao = this.gl.createVertexArray();
      this.uniforms = {
        resolution: this.gl.getUniformLocation(this.program, "uResolution"),
        cssResolution: this.gl.getUniformLocation(this.program, "uCssResolution"),
        offset: this.gl.getUniformLocation(this.program, "uOffset"),
        dpr: this.gl.getUniformLocation(this.program, "uDpr"),
        time: this.gl.getUniformLocation(this.program, "uTime"),
        open: this.gl.getUniformLocation(this.program, "uOpen"),
        listening: this.gl.getUniformLocation(this.program, "uListening"),
        thinking: this.gl.getUniformLocation(this.program, "uThinking"),
        backdrop: this.gl.getUniformLocation(this.program, "uBackdrop"),
      };
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.disable(this.gl.STENCIL_TEST);
    } catch (error) {
      this.error = error;
    }
  }

  setBackdrop(backdrop) {
    this.backdrop = backdrop;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(window.innerWidth * dpr));
    const height = Math.max(1, Math.round(window.innerHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.dpr = dpr;
    this.width = width;
    this.height = height;
    this.cssWidth = width / dpr;
    this.cssHeight = height / dpr;
  }

  render({ mode = "idle", offset = [0, 0], time = 0 } = {}) {
    if (this.ctx2d && !this.gl) {
      this._render2d({ mode, offset, time });
      return;
    }
    if (!this.gl || this.error) return;
    this.mode = mode;
    this.resize();
    const gl = this.gl;
    const open = mode === "ask" || mode === "reply" ? 1 : 0;
    gl.viewport(0, 0, this.width, this.height);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.uniform2f(this.uniforms.resolution, this.width, this.height);
    gl.uniform2f(this.uniforms.cssResolution, this.cssWidth, this.cssHeight);
    gl.uniform2f(this.uniforms.offset, offset[0], offset[1]);
    gl.uniform1f(this.uniforms.dpr, this.dpr);
    gl.uniform1f(this.uniforms.time, time);
    gl.uniform1f(this.uniforms.open, open);
    gl.uniform1f(this.uniforms.listening, mode === "listening" ? 1 : 0);
    gl.uniform1f(this.uniforms.thinking, mode === "thinking" ? 1 : 0);
    gl.uniform1i(this.uniforms.backdrop, BACKDROPS[this.backdrop] ?? BACKDROPS.black);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  _render2d({ mode = "idle", offset = [0, 0], time = 0 } = {}) {
    const ctx = this.ctx2d;
    this.resize();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const w = this.cssWidth;
    const h = this.cssHeight;
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, w, h);
    if (this.backdrop === "white") {
      bg.addColorStop(0, "#fbfbfb");
      bg.addColorStop(1, "#f3f3f5");
    } else if (this.backdrop === "tahoe") {
      bg.addColorStop(0, "#2e8dc3");
      bg.addColorStop(0.56, "#86d4d6");
      bg.addColorStop(1, "#5fc6b3");
    } else if (this.backdrop === "sonoma") {
      bg.addColorStop(0, "#1b102f");
      bg.addColorStop(0.48, "#4a2d89");
      bg.addColorStop(1, "#bf5d63");
    } else {
      bg.addColorStop(0, "#000");
      bg.addColorStop(1, "#000");
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const x = w / 2 + offset[0];
    const y = h / 2 + offset[1];
    const open = mode === "ask" || mode === "reply";
    if (open) this._drawPill2d(ctx, x, y, Math.min(458, w - 42), 146);
    else this._drawOrb2d(ctx, x, y, 66, time, mode === "listening" || mode === "thinking");
    if (mode === "thinking") this._drawDots2d(ctx, x, y, time);
  }

  _drawPill2d(ctx, x, y, width, height) {
    const left = x - width / 2;
    const top = y - height / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.72)";
    ctx.shadowBlur = 80;
    ctx.shadowOffsetY = 22;
    ctx.fillStyle = "rgba(4,4,5,.56)";
    ctx.strokeStyle = "rgba(255,255,255,.09)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(left, top, width, height, height / 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,.05)";
    ctx.beginPath();
    ctx.roundRect(left + 1, top + 1, width - 2, height - 2, height / 2);
    ctx.stroke();
    ctx.restore();
  }

  _drawOrb2d(ctx, x, y, radius, time, active) {
    const pulse = radius + Math.sin(time * 1.6) * (active ? 4 : 2);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(x, y, 4, x, y, pulse * 3);
    glow.addColorStop(0, active ? "rgba(78,120,255,.26)" : "rgba(68,94,255,.16)");
    glow.addColorStop(0.4, "rgba(66,118,255,.08)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, pulse * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pulse, 0, Math.PI * 2);
    ctx.clip();

    const body = ctx.createRadialGradient(x - pulse * 0.35, y - pulse * 0.55, 2, x, y, pulse * 1.2);
    body.addColorStop(0, "rgba(255,246,206,.28)");
    body.addColorStop(0.25, "rgba(255,204,126,.12)");
    body.addColorStop(0.48, "rgba(36,42,74,.22)");
    body.addColorStop(0.74, "rgba(16,18,24,.76)");
    body.addColorStop(1, "rgba(0,0,0,.88)");
    ctx.fillStyle = body;
    ctx.fillRect(x - pulse, y - pulse, pulse * 2, pulse * 2);

    const spectral = ctx.createLinearGradient(x - pulse, y - pulse * 0.08, x + pulse, y - pulse * 0.16);
    spectral.addColorStop(0, "rgba(0,0,0,0)");
    spectral.addColorStop(0.22, "rgba(60,166,255,.66)");
    spectral.addColorStop(0.45, "rgba(255,88,42,.72)");
    spectral.addColorStop(0.58, "rgba(255,222,116,.62)");
    spectral.addColorStop(0.76, "rgba(74,255,175,.52)");
    spectral.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = spectral;
    ctx.lineWidth = active ? 10 : 8;
    ctx.beginPath();
    for (let i = 0; i <= 110; i += 1) {
      const p = i / 110;
      const px = x - pulse * 0.9 + p * pulse * 1.8;
      const py = y - pulse * 0.05 + Math.sin(p * Math.PI * 2 + time * 1.2) * 3;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.36)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(x, y, pulse + 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(92,95,255,.44)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, pulse + 3, Math.PI * 0.76, Math.PI * 1.86);
    ctx.stroke();
    ctx.restore();
  }

  _drawDots2d(ctx, x, y, time) {
    ctx.save();
    ctx.fillStyle = "rgba(245,245,247,.86)";
    ctx.shadowColor = "rgba(245,245,247,.45)";
    ctx.shadowBlur = 16;
    for (let i = 0; i < 6; i += 1) {
      const angle = time * 2.6 + i * (Math.PI / 3);
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * 55, y + Math.sin(angle) * 55, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  dispose() {
    if (!this.gl) return;
    this.gl.deleteProgram(this.program);
    this.gl.deleteVertexArray(this.vao);
  }
}
