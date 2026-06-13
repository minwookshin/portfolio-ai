import { createAskFlow } from "./ask-flow.js";
import { SiriRenderer } from "./renderer.js";
import { Spring } from "./spring.js";

const HINTS = {
  idle: "Click to ask · hold to speak",
  ask: "Enter to send · Esc to close",
  thinking: "Thinking…",
  reply: "",
  listening: "Listening…",
};

const page = document.querySelector(".siri-page");
const canvas = document.querySelector("#siri27-canvas");
const hint = document.querySelector("#siri-hint");
const micStatus = document.querySelector("#mic-status");
const pillOverlay = document.querySelector("#pill-overlay");
const backdropButtons = Array.from(document.querySelectorAll(".backdrops button"));

const renderer = new SiriRenderer(canvas);
if (renderer.error) micStatus.textContent = renderer.error.message;

const flow = createAskFlow({
  dom: {
    panel: document.querySelector("#ask-panel"),
    form: document.querySelector("#ask-form"),
    input: document.querySelector("#ask-input"),
    chips: document.querySelector("#ask-chips"),
    card: document.querySelector("#answer-card"),
    text: document.querySelector("#answer-text"),
  },
  onMode: (mode) => setVisualMode(mode),
});

const dragX = new Spring(0, { response: 0.3, dampingRatio: 0.85 });
const dragY = new Spring(0, { response: 0.3, dampingRatio: 0.85 });

let rafId = 0;
let prevTimestamp = 0;
let pressedInside = false;
let dragging = false;
let moved = false;
let voiceHold = false;
let longPressTimer = 0;
let grabPointer = [0, 0];
let grabOffset = [0, 0];
let visualMode = "idle";

function setHint(text) {
  hint.textContent = text;
}

function setVisualMode(mode) {
  if (voiceHold && mode === "idle") mode = "listening";
  visualMode = mode;
  page.dataset.mode = mode;
  setHint(HINTS[mode] ?? "");
  micStatus.textContent = mode === "listening" ? "Listening." : mode === "idle" ? "Idle." : mode;
}

function setBackdrop(mode) {
  page.dataset.backdrop = mode;
  renderer.setBackdrop(mode);
  backdropButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.backdrop === mode));
  });
}

function currentCenter() {
  return {
    x: window.innerWidth * 0.5 + dragX.target,
    y: window.innerHeight * 0.5 + dragY.target,
  };
}

function hitGlass(clientX, clientY) {
  const center = currentCenter();
  const mode = flow.mode;
  const open = mode === "ask" || mode === "reply";
  if (!open) {
    return Math.hypot(clientX - center.x, clientY - center.y) <= 92;
  }
  const width = Math.min(458, window.innerWidth - 42);
  const halfW = width * 0.5 + 22;
  const halfH = 73 + 22;
  return Math.abs(clientX - center.x) <= halfW && Math.abs(clientY - center.y) <= halfH;
}

function clampedOffset(x, y) {
  const keep = 100;
  const maxX = Math.max(0, window.innerWidth * 0.5 - keep);
  const maxY = Math.max(0, window.innerHeight * 0.5 - keep);
  return [Math.min(maxX, Math.max(-maxX, x)), Math.min(maxY, Math.max(-maxY, y))];
}

function startVoiceHold() {
  longPressTimer = 0;
  if (!dragging || moved || flow.mode !== "idle") return;
  voiceHold = true;
  setVisualMode("listening");
}

function endVoiceHold() {
  if (!voiceHold) return;
  voiceHold = false;
  setVisualMode(flow.mode);
}

function onPointerDown(event) {
  canvas.setPointerCapture(event.pointerId);
  moved = false;
  pressedInside = hitGlass(event.clientX, event.clientY);
  grabPointer = [event.clientX, event.clientY];
  grabOffset = [dragX.target, dragY.target];
  if (pressedInside) {
    dragging = true;
    page.dataset.dragging = "true";
    if (flow.mode === "idle") longPressTimer = window.setTimeout(startVoiceHold, 450);
  }
}

function onPointerMove(event) {
  if (!dragging) return;
  const dx = event.clientX - grabPointer[0];
  const dy = event.clientY - grabPointer[1];
  if (!moved && Math.hypot(dx, dy) > 6) {
    moved = true;
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
  page.dataset.dragging = "false";
  window.clearTimeout(longPressTimer);
  longPressTimer = 0;
  const wasVoice = voiceHold;
  endVoiceHold();
  if (!event || event.type !== "pointerup") return;
  if (wasVoice) return;
  if (wasDragging && moved) return;

  if (pressedInside) {
    if (flow.mode === "idle" || flow.mode === "reply") flow.openAsk();
    else if (flow.mode === "thinking") flow.close();
  } else if (flow.mode !== "idle") {
    flow.close();
  }
}

function frame(now) {
  const dt = prevTimestamp ? Math.min((now - prevTimestamp) / 1000, 0.1) : 0;
  prevTimestamp = now;
  const x = dragX.step(dt);
  const y = dragY.step(dt);
  page.style.setProperty("--drag-x", `${x}px`);
  page.style.setProperty("--drag-y", `${y}px`);
  pillOverlay.style.setProperty("--drag-x", `${x}px`);
  pillOverlay.style.setProperty("--drag-y", `${y}px`);
  flow.tick(dt);
  renderer.render({ mode: visualMode, offset: [x, y], time: now / 1000 });
  rafId = requestAnimationFrame(frame);
}

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onRelease);
canvas.addEventListener("pointercancel", onRelease);
canvas.addEventListener("lostpointercapture", onRelease);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && flow.mode !== "idle") flow.close();
});

backdropButtons.forEach((button) => {
  button.addEventListener("click", () => setBackdrop(button.dataset.backdrop));
});

setBackdrop("black");
setVisualMode("idle");
rafId = requestAnimationFrame(frame);

window.__siri = { flow, renderer };

window.addEventListener(
  "pagehide",
  () => {
    cancelAnimationFrame(rafId);
    renderer.dispose();
  },
  { once: true },
);
