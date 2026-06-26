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
    expect(DESIGN_SYSTEM_COMPONENTS.map((component) => component.name)).toContain("ai chat and recruiter intake");
  });

  it("generates an AI-readable markdown contract", () => {
    const markdown = generateDesignSystemMarkdown();

    expect(markdown).toContain("https://www.minwookshin.com/design-system");
    expect(markdown).toContain("## AI-readable contract");
    expect(markdown).toContain("Keep the public site in light mode");
    expect(markdown).toContain("Do not invent metrics, employers, awards, repository links, or project outcomes.");
  });
});
