import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chip } from "@/components/material/Chip";

describe("Chip", () => {
  it("renders label and is a button", () => {
    render(<Chip>Projects</Chip>);
    expect(screen.getByRole("button", { name: "Projects" })).toBeInTheDocument();
  });

  it("reflects selected state via aria-pressed", () => {
    render(<Chip selected>Projects</Chip>);
    expect(screen.getByRole("button", { name: "Projects" })).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Projects</Chip>);
    await userEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
