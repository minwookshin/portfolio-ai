const MIN_THINK_MS = 1400;
const FALLBACK_REPLY = "no answer right now";

export function createAskFlow({ dom, onMode }) {
  const { panel, form, input, chips, card, text } = dom;
  let mode = "idle";
  let timer = 0;

  function setMode(next) {
    mode = next;
    panel.classList.toggle("on", next === "ask");
    card.classList.toggle("on", next === "reply");
    if (onMode) onMode(next);
  }

  function clearTimer() {
    window.clearTimeout(timer);
    timer = 0;
  }

  function reveal(message) {
    text.textContent = "";
    const span = document.createElement("span");
    span.className = "reveal";
    span.textContent = message;
    text.appendChild(span);
  }

  function openAsk() {
    clearTimer();
    text.textContent = "";
    input.value = "";
    setMode("ask");
    window.setTimeout(() => input.focus({ preventScroll: true }), 220);
  }

  function close() {
    clearTimer();
    input.blur();
    input.value = "";
    text.textContent = "";
    setMode("idle");
  }

  function ask(question) {
    const clean = question.trim();
    if (!clean) return;
    clearTimer();
    input.blur();
    text.textContent = "";
    setMode("thinking");
    timer = window.setTimeout(() => {
      reveal(FALLBACK_REPLY);
      setMode("reply");
    }, MIN_THINK_MS);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });

  chips.querySelectorAll("button").forEach((chip) => {
    chip.addEventListener("click", () => ask(chip.textContent || ""));
  });

  card.addEventListener("click", () => {
    if (mode === "reply") openAsk();
  });

  return {
    get mode() {
      return mode;
    },
    openAsk,
    close,
    ask,
    tick() {},
  };
}
