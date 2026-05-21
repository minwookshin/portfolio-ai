import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SplitButton } from "@/components/material/SplitButton";

describe("SplitButton", () => {
  const menu = [
    { label: "Option A", onSelect: vi.fn() },
    { label: "Option B", onSelect: vi.fn() },
  ];

  it("renders the primary action and a menu trigger", () => {
    render(<SplitButton label="Save" onClick={vi.fn()} menuItems={menu} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More options" })).toBeInTheDocument();
  });

  it("fires the primary onClick", async () => {
    const onClick = vi.fn();
    render(<SplitButton label="Save" onClick={onClick} menuItems={menu} />);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles the menu and selects an item", async () => {
    const items = [{ label: "Option A", onSelect: vi.fn() }];
    render(<SplitButton label="Save" onClick={vi.fn()} menuItems={items} />);
    await userEvent.click(screen.getByRole("button", { name: "More options" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Option A" }));
    expect(items[0].onSelect).toHaveBeenCalledOnce();
  });
});
