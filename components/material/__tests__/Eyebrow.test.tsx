import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/material/Eyebrow";

describe("Eyebrow", () => {
  it("renders uppercased label text content", () => {
    render(<Eyebrow>meet minwook junior</Eyebrow>);
    // text is uppercased via CSS; the DOM text stays as provided
    expect(screen.getByText("meet minwook junior")).toBeInTheDocument();
  });

  it("applies the space-mono font family class", () => {
    render(<Eyebrow>label</Eyebrow>);
    expect(screen.getByText("label").className).toContain("font-mono");
  });
});
