import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "@/components/material/Card";

describe("Card", () => {
  it("renders children as a non-interactive region by default", () => {
    render(<Card>Body</Card>);
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("becomes a button and fires onClick when interactive", async () => {
    const onClick = vi.fn();
    render(<Card interactive onClick={onClick}>Body</Card>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
