import { describe, it, expect } from "vitest";
import { springs } from "@/lib/material/motion";

describe("springs", () => {
  it("exposes the three expressive spring tokens with type spring", () => {
    expect(springs.spatialDefault).toEqual({ type: "spring", stiffness: 240, damping: 30, mass: 1.5 });
    expect(springs.spatialFast).toEqual({ type: "spring", stiffness: 320, damping: 28, mass: 1.3 });
    expect(springs.pressMorph).toEqual({ type: "spring", stiffness: 380, damping: 26, mass: 1.4 });
  });
});
