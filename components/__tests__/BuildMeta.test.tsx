import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import BuildMeta from "@/components/BuildMeta";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("BuildMeta", () => {
  it("renders hydration-safe relative time on the server", () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("2030-01-01T00:00:00.000Z").getTime());

    const html = renderToString(<BuildMeta />);

    expect(html).toContain("updated");
    expect(html).toContain("0d 0h 0m 0s before");
  });
});
