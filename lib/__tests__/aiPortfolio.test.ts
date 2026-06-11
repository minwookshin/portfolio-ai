import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  generatePortfolioMarkdown,
  generateResumeJson,
  generateWorkProjectMarkdown,
} from "@/lib/aiPortfolio";

describe("AI-readable portfolio proof", () => {
  it("adds a recruiter-facing proof matrix to portfolio markdown", () => {
    const markdown = generatePortfolioMarkdown();

    expect(markdown).toContain("### Project proof matrix");
    expect(markdown).toContain("Portfolio AI: Ownership=Design Engineer - designed & built solo");
    expect(markdown).toContain("Public proof=public repo / live site / demo video");
  });

  it("exposes recruiter proof in resume JSON", () => {
    const resume = generateResumeJson();
    const portfolioAi = resume.selectedWork.find((project) => project.title === "Portfolio AI");

    expect(portfolioAi?.recruiterProof).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Ownership", value: "Design Engineer - designed & built solo" }),
        expect.objectContaining({ label: "Public proof", value: "public repo / live site / demo video" }),
      ]),
    );
  });

  it("includes proof signals in project markdown routes", () => {
    const markdown = generateWorkProjectMarkdown("sentinel");

    expect(markdown).toContain("## Recruiter summary");
    expect(markdown).toContain("- Public proof: public repo / demo video / public post");
    expect(markdown).toContain("- Outcome: Winner - Google x SCAD FLUX Hackathon 2025");
  });
});
