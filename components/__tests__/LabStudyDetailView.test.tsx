import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("LabStudyDetailView interactions", () => {
  it("shows the motion taste change on hover and focus", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("motion-taste-system")} />);

    const sample = screen.getByRole("button", { name: "motion taste hover sample" });
    expect(sample).toHaveAttribute("data-active", "false");
    expect(screen.getByText("resting state stays quiet")).toBeInTheDocument();

    await user.hover(sample);
    await waitFor(() => expect(sample).toHaveAttribute("data-active", "true"));
    expect(screen.getByText("copy shifts, preview wakes")).toBeInTheDocument();

    await user.unhover(sample);
    await waitFor(() => expect(sample).toHaveAttribute("data-active", "false"));

    fireEvent.focus(sample);
    await waitFor(() => expect(sample).toHaveAttribute("data-active", "true"));
  });

  it("switches the hover row preview by hover and click", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("hover-row-study")} />);
    const preview = screen.getByRole("status", { name: "active hover preview" });

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

    await user.click(screen.getByRole("button", { name: "studies" }));
    await waitFor(() => expect(screen.getByText("thinking in motion")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "studies" })).toHaveAttribute("aria-pressed", "true");
  });

  it("activates cursor study targets with pointer, focus, and click", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("cursor-study")} />);

    const precision = screen.getByRole("button", { name: "precision zone" });
    fireEvent.pointerEnter(precision);
    await waitFor(() => expect(precision).toHaveAttribute("data-active", "true"));

    const interactive = screen.getByRole("button", { name: "interactive text" });
    fireEvent.focus(interactive);
    await waitFor(() => expect(interactive).toHaveAttribute("data-active", "true"));

    await user.click(screen.getByRole("button", { name: "default surface" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "default surface" })).toHaveAttribute("data-active", "true"));
  });

  it("updates motion curve controls", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("motion-curve-tester")} />);

    fireEvent.change(screen.getByRole("slider", { name: /duration/i }), { target: { value: "320" } });
    expect(screen.getByText("duration 320ms")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "in-out" }));
    expect(screen.getByRole("button", { name: "in-out" })).toHaveAttribute("aria-pressed", "true");
  });

  it("lets the AI loop study move between trace steps", async () => {
    const user = userEvent.setup();
    render(<LabStudyDetailView project={getStudyProject("interface-is-the-loop")} />);

    expect(screen.getByText("Capture the user's goal before the model plans around the wrong target.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /checkpoint/i }));
    await waitFor(() => {
      expect(screen.getByText("Pause before irreversible or high-context actions so the user can steer, not rubber-stamp.")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "resume loop" })).toBeInTheDocument();
  });
});
