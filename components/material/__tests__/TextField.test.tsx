import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "@/components/material/TextField";

describe("TextField", () => {
  it("renders an input with the given placeholder and value", () => {
    render(<TextField value="hello" onChange={() => {}} placeholder="Ask me" />);
    const input = screen.getByPlaceholderText("Ask me") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("hello");
  });

  it("calls onChange with typed text", async () => {
    const onChange = vi.fn();
    render(<TextField value="" onChange={onChange} placeholder="Ask me" />);
    await userEvent.type(screen.getByPlaceholderText("Ask me"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("renders trailing slot content", () => {
    render(
      <TextField value="" onChange={() => {}} placeholder="Ask me" trailing={<span>send</span>} />
    );
    expect(screen.getByText("send")).toBeInTheDocument();
  });
});
