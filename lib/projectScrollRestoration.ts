const PROJECT_SCROLL_KEY = "minwook:project-open-scroll";

type ProjectScrollSnapshot = {
  x: number;
  y: number;
  at: number;
};

export function saveProjectOpenScroll() {
  if (typeof window === "undefined") return;

  try {
    const snapshot: ProjectScrollSnapshot = {
      x: window.scrollX,
      y: window.scrollY,
      at: Date.now(),
    };
    window.sessionStorage.setItem(PROJECT_SCROLL_KEY, JSON.stringify(snapshot));
  } catch {
    // Session storage can be unavailable in hardened browser modes.
  }
}

export function restoreProjectOpenScroll() {
  if (typeof window === "undefined") return false;

  let snapshot: ProjectScrollSnapshot | null = null;

  try {
    const raw = window.sessionStorage.getItem(PROJECT_SCROLL_KEY);
    if (!raw) return false;
    window.sessionStorage.removeItem(PROJECT_SCROLL_KEY);
    snapshot = JSON.parse(raw) as ProjectScrollSnapshot;
  } catch {
    return false;
  }

  if (!snapshot || !Number.isFinite(snapshot.x) || !Number.isFinite(snapshot.y)) {
    return false;
  }

  const restore = () => {
    window.scrollTo({
      left: snapshot.x,
      top: snapshot.y,
      behavior: "auto",
    });
  };

  restore();
  window.requestAnimationFrame(() => {
    restore();
    window.requestAnimationFrame(restore);
  });

  return true;
}
