import { describe, expect, it, vi } from "vitest";
import { getProjectBySlug } from "@/data/projects";
import {
  buildCommandItems,
  getCommandSearchPlaceholder,
  getCurrentContext,
} from "@/components/commandPaletteItems";
import type { WritingPostMeta } from "@/lib/writingTypes";

describe("command palette items", () => {
  it("prioritizes home commands as a minimal control layer", () => {
    const items = buildCommandItems({
      askAboutPortfolio: vi.fn(),
      contextLabel: "index",
      copyText: vi.fn(),
      currentProject: null,
      jumpToId: vi.fn(),
      openShortcuts: vi.fn(),
      pathname: "/",
      push: vi.fn(),
      writingPosts: [],
    });

    expect(items.slice(0, 4).map((item) => item.id)).toEqual([
      "view-work",
      "view-notes",
      "ask-portfolio",
      "copy-email",
    ]);
    expect(items.filter((item) => item.defaultVisible).map((item) => item.id)).toEqual([
      "view-work",
      "view-notes",
      "ask-portfolio",
      "copy-email",
      "open-design-system",
      "copy-current-link",
    ]);
  });

  it("recognizes note detail pages as note context", () => {
    const writingPosts: WritingPostMeta[] = [
      {
        date: "2026-06-03",
        description: "A short note about code and design.",
        relatedWork: [],
        slug: "learned-to-code-first",
        title: "i learned to code first",
      },
    ];
    const items = buildCommandItems({
      askAboutPortfolio: vi.fn(),
      contextLabel: "note",
      copyText: vi.fn(),
      currentProject: null,
      jumpToId: vi.fn(),
      openShortcuts: vi.fn(),
      pathname: "/notes/learned-to-code-first",
      push: vi.fn(),
      writingPosts,
    });

    expect(getCurrentContext("/notes/learned-to-code-first", null, writingPosts)).toBe("note");
    expect(getCommandSearchPlaceholder("/notes/learned-to-code-first", null, writingPosts)).toBe("search note");
    expect(items.filter((item) => item.defaultVisible).map((item) => item.id)).toEqual([
      "copy-current-link",
      "view-notes",
      "view-index",
      "view-work",
    ]);
  });

  it("adds Atlas artifact commands on the Atlas page", () => {
    const atlas = getProjectBySlug("atlas");
    const jumpToId = vi.fn();

    if (!atlas) {
      throw new Error("Missing Atlas fixture");
    }

    const items = buildCommandItems({
      askAboutPortfolio: vi.fn(),
      contextLabel: "atlas",
      copyText: vi.fn(),
      currentProject: atlas,
      jumpToId,
      openShortcuts: vi.fn(),
      pathname: "/work/atlas",
      push: vi.fn(),
      writingPosts: [],
    });

    expect(items.map((item) => item.id)).toEqual(expect.arrayContaining([
      "atlas-motion-rule",
      "atlas-patient-detail",
      "atlas-reflection",
    ]));
    expect(items.slice(0, 6).map((item) => item.id)).toEqual([
      "atlas-proof-bento",
      "atlas-capacity-state",
      "atlas-event-contract",
      "atlas-decision-log",
      "open-design-system",
      "view-work",
    ]);
  });
});
