import type { Transition } from "framer-motion";

export const motionDurations = {
  none: 0,
  instant: 0.12,
  fast: 0.18,
  base: 0.25,
  slow: 0.35,
  slower: 0.5,
  extended: 0.7,
  reveal: 0.8,
  ambient: 1.4,
  flash: 2.4,
} as const;

export const motionEasings = {
  standard: [0.22, 1, 0.36, 1],
  inOut: [0.45, 0, 0.55, 1],
  emphasized: [0.34, 1.28, 0.5, 1],
} as const;

export const tweens = {
  none: { duration: motionDurations.none },
  instant: { type: "tween", duration: motionDurations.instant, ease: motionEasings.standard },
  fast: { type: "tween", duration: motionDurations.fast, ease: motionEasings.standard },
  base: { type: "tween", duration: motionDurations.base, ease: motionEasings.standard },
  commandLens: { type: "tween", duration: 0.2, ease: motionEasings.standard },
  slow: { type: "tween", duration: motionDurations.slow, ease: motionEasings.standard },
  slower: { type: "tween", duration: motionDurations.slower, ease: motionEasings.standard },
  extended: { type: "tween", duration: motionDurations.extended, ease: motionEasings.standard },
  reveal: { type: "tween", duration: motionDurations.reveal, ease: motionEasings.emphasized },
  slowInOut: { type: "tween", duration: motionDurations.slow, ease: motionEasings.inOut },
} satisfies Record<string, Transition>;

export const springs = {
  spatialDefault: { type: "spring", stiffness: 240, damping: 30, mass: 1.5 },
  spatialFast: { type: "spring", stiffness: 320, damping: 28, mass: 1.3 },
  pressMorph: { type: "spring", stiffness: 380, damping: 26, mass: 1.4 },
  // Sticky/weighted with a gentle settle — for detail reveals.
  genOvershoot: { type: "spring", stiffness: 230, damping: 26, mass: 1.4 },
  // Dynamic-Island feel: weighted + a low ~0.5 damping ratio so shapes morph
  // with real inertia and a sticky, slightly-overshooting settle. Used for the
  // bottom pill morph, the name rise, and the detail/profile expand.
  island: { type: "spring", stiffness: 190, damping: 19, mass: 1.3 },
} satisfies Record<string, Transition>;

export const glassLensTransition = {
  opacity: { duration: 0.16, ease: motionEasings.standard },
  width: { type: "spring", duration: 0.34, bounce: 0.04 },
  height: { type: "spring", duration: 0.34, bounce: 0.04 },
  x: { type: "spring", duration: 0.38, bounce: 0.06 },
  y: { type: "spring", duration: 0.38, bounce: 0.06 },
} satisfies Transition;
