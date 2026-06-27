import { describe, expect, it } from "vitest";
import {
  DESIGN_SYSTEM_COMPONENTS,
  DESIGN_SYSTEM_PATHS,
  DESIGN_SYSTEM_TOKENS,
  generateDesignSystemMarkdown,
} from "@/lib/designSystemProof";

describe("design system proof", () => {
  it("exposes the public proof routes", () => {
    expect(DESIGN_SYSTEM_PATHS).toEqual({
      page: "/design-system",
      markdown: "/design-system.md",
      tokens: "/design-system/tokens.json",
      portfolioAi: "/work/portfolio-ai",
      interactions: "/interactions",
    });
  });

  it("documents existing token roles and component primitives", () => {
    expect(DESIGN_SYSTEM_TOKENS.colors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ role: "theme.light.background", value: "#FAFAFA" }),
        expect.objectContaining({ role: "background.base", value: "light-only" }),
        expect.objectContaining({ role: "text.primary", value: "light-only" }),
        expect.objectContaining({ role: "text.muted", value: "light-only" }),
      ]),
    );
    expect(DESIGN_SYSTEM_TOKENS.signals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ role: "cell.inline", cssVariable: "--signal-cell-inline", value: "18px" }),
        expect.objectContaining({ role: "dot.hollow", cssVariable: "--signal-dot-size-hollow", value: "6px" }),
        expect.objectContaining({ role: "dot.border", cssVariable: "--signal-border-hollow", value: "1px" }),
        expect.objectContaining({ role: "icon.arrow", cssVariable: "--signal-icon-size", value: "16px" }),
        expect.objectContaining({ role: "motion.nudge", cssVariable: "--signal-nudge", value: "2px" }),
        expect.objectContaining({ role: "motion.draw", cssVariable: "--signal-draw-duration", value: "140ms" }),
      ]),
    );
    expect(DESIGN_SYSTEM_COMPONENTS.map((component) => component.name)).toEqual(
      expect.arrayContaining(["ai chat and recruiter intake", "live interaction OS"]),
    );
  });

  it("generates an AI-readable markdown contract", () => {
    const markdown = generateDesignSystemMarkdown();

    expect(markdown).toContain("https://www.minwookshin.com/design-system");
    expect(markdown).toContain("## AI-readable contract");
    expect(markdown).toContain("### Outline signals");
    expect(markdown).toContain("--signal-nudge");
    expect(markdown).toContain("Keep the public site in light mode");
    expect(markdown).toContain("Do not invent metrics, employers, awards, repository links, or project outcomes.");
  });
});
