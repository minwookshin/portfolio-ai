import { describe, it, expect } from "vitest";
import { springs } from "@/lib/material/motion";

describe("springs", () => {
  it("exposes the three expressive spring tokens with type spring", () => {
    expect(springs.spatialDefault).toEqual({ type: "spring", stiffness: 380, damping: 32, mass: 1 });
    expect(springs.spatialFast).toEqual({ type: "spring", stiffness: 520, damping: 30 });
    expect(springs.pressMorph).toEqual({ type: "spring", stiffness: 600, damping: 24 });
  });
});
