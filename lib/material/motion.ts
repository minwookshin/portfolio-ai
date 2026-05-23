import type { Transition } from "framer-motion";

export const springs = {
  spatialDefault: { type: "spring", stiffness: 240, damping: 30, mass: 1.5 },
  spatialFast: { type: "spring", stiffness: 320, damping: 28, mass: 1.3 },
  pressMorph: { type: "spring", stiffness: 380, damping: 26, mass: 1.4 },
  // Sticky/weighted with a gentle settle — for the modal expand and reveals.
  genOvershoot: { type: "spring", stiffness: 230, damping: 26, mass: 1.4 },
  // Dynamic-Island feel: lowish stiffness + ~0.6 damping ratio so the shape
  // morphs with a little alive bounce and settles softly. Used for the bottom
  // pill morph and the detail/profile expand.
  island: { type: "spring", stiffness: 200, damping: 18, mass: 1 },
} satisfies Record<string, Transition>;
