import type { Transition } from "framer-motion";

export const springs = {
  spatialDefault: { type: "spring", stiffness: 240, damping: 30, mass: 1.5 },
  spatialFast: { type: "spring", stiffness: 320, damping: 28, mass: 1.3 },
  pressMorph: { type: "spring", stiffness: 380, damping: 26, mass: 1.4 },
  // Sticky/weighted with a gentle settle — for the modal expand and reveals.
  genOvershoot: { type: "spring", stiffness: 230, damping: 26, mass: 1.4 },
  // Dynamic-Island feel: weighted + a low ~0.5 damping ratio so shapes morph
  // with real inertia and a sticky, slightly-overshooting settle. Used for the
  // bottom pill morph, the name rise, and the detail/profile expand.
  island: { type: "spring", stiffness: 190, damping: 19, mass: 1.3 },
} satisfies Record<string, Transition>;
