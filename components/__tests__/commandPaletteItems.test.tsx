import { describe, expect, it, vi } from "vitest";
import { ATLAS_EVENT_CONTRACT } from "@/data/atlasProof";
import { getProjectBySlug } from "@/data/projects";
import { buildCommandItems } from "@/components/commandPaletteItems";

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
      "copy-email",
      "ask-portfolio",
    ]);
  });

  it("adds Atlas artifact commands on the Atlas page", () => {
    const atlas = getProjectBySlug("atlas");
    const copyText = vi.fn();
    const jumpToId = vi.fn();

    if (!atlas) {
      throw new Error("Missing Atlas fixture");
    }

    const items = buildCommandItems({
      askAboutPortfolio: vi.fn(),
      contextLabel: "atlas",
      copyText,
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
      "copy-atlas-event-contract",
      "copy-atlas-decision-log",
      "copy-atlas-capacity-link",
    ]));
    expect(items.slice(0, 5).map((item) => item.id)).toEqual([
      "atlas-proof-bento",
      "atlas-capacity-state",
      "copy-project-link",
      "copy-atlas-decision-log",
      "copy-atlas-capacity-link",
    ]);

    items.find((item) => item.id === "copy-atlas-event-contract")?.action();

    expect(copyText).toHaveBeenCalledWith(ATLAS_EVENT_CONTRACT, "event contract");
  });
});
