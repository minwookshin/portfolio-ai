import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "@/components/material/IconButton";

describe("IconButton", () => {
  it("requires and exposes an accessible label", () => {
    render(<IconButton aria-label="Send"><span>icon</span></IconButton>);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("reflects size and selected state", () => {
    render(<IconButton aria-label="Mic" size="lg" selected><span>icon</span></IconButton>);
    const btn = screen.getByRole("button", { name: "Mic" });
    expect(btn).toHaveAttribute("data-size", "lg");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onClick when enabled", async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Send" onClick={onClick}><span>icon</span></IconButton>);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
