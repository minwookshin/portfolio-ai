import type { Transition } from "framer-motion";

export const springs = {
  spatialDefault: { type: "spring", stiffness: 380, damping: 32, mass: 1 },
  spatialFast: { type: "spring", stiffness: 520, damping: 30 },
  pressMorph: { type: "spring", stiffness: 600, damping: 24 },
} satisfies Record<string, Transition>;
