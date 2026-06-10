import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LabStudyDetailView from "@/components/LabStudyDetailView";
import { getProjectBySlug, isLabStudyProject } from "@/data/projects";

function getStudyProject(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project || !isLabStudyProject(project)) {
    throw new Error(`Missing lab study fixture: ${slug}`);
  }
  return project;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("LabStudyDetailView interactions", () => {
  it("runs the motion taste hold interaction", () => {
    vi.useFakeTimers();
    render(<LabStudyDetailView project={getStudyProject("motion-taste-system")} />);

    expect(screen.getByText("160ms")).toBeInTheDocument();
    expect(screen.getByText("1200ms")).toBeInTheDocument();
    expect(screen.getByText("120-180ms")).toBeInTheDocument();

    const sample = screen.getByRole("button", { name: "hold to commit motion sample" });
    expect(sample).toHaveAttribute("data-state", "idle");
    expect(screen.getByRole("status")).toHaveTextContent("waiting for sustained input");

    fireEvent.pointerDown(sample);
    expect(sample).toHaveAttribute("data-state", "holding");
    expect(screen.getByRole("status")).toHaveTextContent("holding intent");

    fireEvent.pointerUp(sample);
    expect(sample).toHaveAttribute("data-state", "idle");

    fireEvent.pointerDown(sample);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(sample).toHaveAttribute("data-state", "complete");
    expect(screen.getByRole("status")).toHaveTextContent("action committed");

    fireEvent.click(screen.getByRole("button", { name: "reset" }));
    expect(sample).toHaveAttribute("data-state", "idle");
  });

  it("switches the hover row preview by hover and click", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("hover-row-study")} />);
    const preview = screen.getByRole("status", { name: "active hover preview" });

    expect(screen.getByText("6px")).toBeInTheDocument();
    expect(screen.getByText("140ms")).toBeInTheDocument();

    expect(preview).toHaveTextContent("sentinel");
    expect(preview).toHaveTextContent("preview handoff leads the hover");

    const atlas = screen.getByRole("button", { name: /atlas: capstone in progress/i });
    await user.hover(atlas);
    await waitFor(() => expect(atlas).toHaveAttribute("data-active", "true"));
    await waitFor(() => expect(preview).toHaveTextContent("atlas"));
    expect(preview).toHaveTextContent("quiet row feedback");

    const portfolioAi = screen.getByRole("button", { name: /portfolio ai: ai intake website/i });
    await user.click(portfolioAi);
    await waitFor(() => expect(portfolioAi).toHaveAttribute("aria-pressed", "true"));
    await waitFor(() => expect(preview).toHaveTextContent("portfolio ai"));
    expect(preview).toHaveTextContent("copy moves just enough");
  });

  it("switches the route transition demo tabs", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("route-transition-study")} />);

    expect(screen.getByText("minwook shin")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "route study path" })).toHaveTextContent("/work");
    expect(screen.getByText("atlas")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "studies" }));
    await waitFor(() => expect(screen.getByRole("status", { name: "route study path" })).toHaveTextContent("/studies"));
    expect(screen.getByText("motion taste system")).toBeInTheDocument();
    expect(screen.getByText("hover row study")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "studies" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("minwook shin")).toBeInTheDocument();
    expect(screen.getByText("180ms")).toBeInTheDocument();
  });

  it("activates cursor study targets with pointer, focus, and click", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("cursor-study")} />);

    const precision = screen.getByRole("button", { name: "precision zone" });
    expect(precision).toHaveAttribute("data-cursor", "native");
    fireEvent.pointerEnter(precision);
    await waitFor(() => expect(precision).toHaveAttribute("data-active", "true"));

    const interactive = screen.getByRole("button", { name: "interactive text" });
    expect(interactive).toHaveAttribute("data-cursor", "interactive");
    fireEvent.focus(interactive);
    await waitFor(() => expect(interactive).toHaveAttribute("data-active", "true"));

    const defaultSurface = screen.getByRole("button", { name: "default surface" });
    expect(defaultSurface).toHaveAttribute("data-cursor", "idle");
    await user.click(defaultSurface);
    await waitFor(() => expect(defaultSurface).toHaveAttribute("data-active", "true"));
  });

  it("switches between predefined motion rules", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("motion-curve-tester")} />);

    expect(screen.getByText("Motion should come from a small set of decisions, not a slider hunt.")).toBeInTheDocument();
    expect(screen.getByText("tweens.base")).toBeInTheDocument();
    expect(screen.getAllByText("250ms").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "route" }));
    expect(screen.getByRole("button", { name: "route" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("tweens.slowInOut")).toBeInTheDocument();
    expect(screen.getByText("Move 72px over 350ms with in-out easing.")).toBeInTheDocument();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("lets the AI loop study move between trace steps", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("interface-is-the-loop")} />);

    const inlineLoopToken = screen
      .getAllByText("loop")
      .find((element) => element.classList.contains("lab-inline-code"));
    expect(inlineLoopToken).toBeDefined();

    expect(screen.getByText("## Loop Decision Tree")).toBeInTheDocument();
    expect(screen.getByText(/checkpoint before action/)).toBeInTheDocument();

    expect(screen.getByText("Capture the user's goal before the model plans around the wrong target.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /checkpoint/i }));
    await waitFor(() => {
      expect(screen.getByText("Pause before irreversible or high-context actions so the user can steer, not rubber-stamp.")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "resume loop" })).toBeInTheDocument();
  });

});
