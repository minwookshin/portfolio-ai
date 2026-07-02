import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectCaseStudyShell from "@/components/ProjectCaseStudyShell";
import { getProjectBySlug, isLabStudyProject } from "@/data/projects";

function getStudyProject(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project || !isLabStudyProject(project)) {
    throw new Error(`Missing study project fixture: ${slug}`);
  }
  return project;
}

function getWorkProject(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project || isLabStudyProject(project)) {
    throw new Error(`Missing work project fixture: ${slug}`);
  }
  return project;
}

function expectNativeVideo(label: string) {
  const video = screen.getByLabelText(label);

  expect(video.tagName).toBe("VIDEO");
  expect(video).toHaveAttribute("controls");
  expect(video).toHaveAttribute("playsinline");
  return video;
}

describe("ProjectCaseStudyShell", () => {
  it("renders work detail navigation as a quiet document path", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("sentinel")} />);

    const nav = screen.getByRole("navigation", { name: "Sentinel navigation" });
    expect(within(nav).getByRole("link", { name: "back to work" })).toHaveAttribute("href", "/work");
    expect(within(nav).getByRole("link", { name: "home" })).toHaveAttribute("href", "/");
    expect(within(nav).queryByRole("button", { name: "copy Sentinel page link" })).not.toBeInTheDocument();
    expect(within(nav).queryByRole("link", { name: "minwook shin" })).not.toBeInTheDocument();
    expect(within(nav).getByText("Sentinel")).toBeInTheDocument();
    expect(screen.getByText("role")).toBeInTheDocument();
    expect(screen.getByText("source · demo · post")).toBeInTheDocument();
    expect(screen.queryByText("build path")).not.toBeInTheDocument();
    expectNativeVideo("Sentinel demo");
  });

  it("renders Sentinel screens as a compact slider", async () => {
    const user = userEvent.setup();
    render(<ProjectCaseStudyShell project={getWorkProject("sentinel")} />);

    expect(screen.getByLabelText("Risk, alerts, actions")).toBeInTheDocument();
    expect(screen.getByText("Historical risk timeline")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "next screen" }));

    expect(screen.getByText("Weather alerts")).toBeInTheDocument();
  });

  it("does not duplicate video-only demos in detail links", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("caret")} />);

    expect(screen.queryByRole("link", { name: /watch demo/i })).not.toBeInTheDocument();
    expect(screen.getByText("public")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/minwookshin/caret");
    expect(screen.getByText("· source")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/posts/minwookshin_nobody-quits-out-of-nowhere-they-burn-out-ugcPost-7432114646523740160-YWsz/",
    );
    expect(screen.getByText("· post")).toBeInTheDocument();
  });

  it("renders small work in video-only mode", () => {
    render(<ProjectCaseStudyShell mode="video-only" project={getWorkProject("tomo")} />);

    expect(screen.getByRole("heading", { name: "Tomo" })).toBeInTheDocument();
    expectNativeVideo("Tomo demo");
    expect(screen.queryByText("links")).not.toBeInTheDocument();
    expect(screen.queryByText("build path")).not.toBeInTheDocument();
  });

  it("renders Portfolio AI links as working public routes", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("portfolio-ai")} />);

    expect(screen.queryByRole("link", { name: /try live site/i })).not.toBeInTheDocument();
    expect(screen.getByText("source · live site")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /video/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Design system" })).toHaveAttribute("href", "/design-system");
    expect(screen.getByRole("link", { name: "Design system markdown" })).toHaveAttribute("href", "/design-system.md");
    expect(screen.getByRole("link", { name: "Design tokens JSON" })).toHaveAttribute("href", "/design-system/tokens.json");
    expect(screen.getByText("· page")).toBeInTheDocument();
    expect(screen.getByText("· markdown")).toBeInTheDocument();
    expect(screen.getByText("· json")).toBeInTheDocument();
  });

  it("renders Atlas as an artifact-led case study template", async () => {
    const user = userEvent.setup();
    render(<ProjectCaseStudyShell project={getWorkProject("atlas")} />);

    expect(screen.getByRole("heading", { name: "atlas / 2026 / ai triage prototype system" })).toBeInTheDocument();
    expect(screen.queryByText("artifact grid")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Atlas interface board")).toBeInTheDocument();
    expect(screen.getByLabelText("Atlas incident command interface")).toBeInTheDocument();
    expect(screen.getByLabelText("Atlas emergency room interface")).toBeInTheDocument();
    expect(screen.getByLabelText("Atlas field responder interface")).toBeInTheDocument();
    expect(screen.getByLabelText("Atlas instruction interface")).toBeInTheDocument();
    expect(screen.getByLabelText("Atlas quick send interface")).toBeInTheDocument();
    expect(screen.getByLabelText("Atlas hospital assignment interface")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "advance hospital load" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "show Hospitals" }));
    expect(screen.getByRole("button", { name: "assign selected hospital" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "confirm hospital assignment" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "advance patient row state" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "advance state" })).toBeInTheDocument();
    expect(screen.getAllByText("event contract")).toHaveLength(1);
    expect(screen.getAllByText("system sketch")).toHaveLength(2);
    expect(screen.queryByLabelText("triage map tile")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("patient row tile")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "patient.assigned" })).toBeInTheDocument();
    expect(screen.queryByLabelText("triage map tile, selected")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "copy capacity state section link" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "copy event contract artifact" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "open" })).not.toBeInTheDocument();
    expect(screen.getByText("server.broadcast(event);")).toBeInTheDocument();
  });

  it("renders study detail navigation as a quiet document path", () => {
    render(
      <ProjectCaseStudyShell
        project={getStudyProject("motion-taste-system")}
        baseHref="/studies"
        variant="lab"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Motion Taste System navigation" });
    expect(within(nav).getByRole("link", { name: "back to studies" })).toHaveAttribute("href", "/studies");
    expect(within(nav).getByRole("link", { name: "home" })).toHaveAttribute("href", "/");
    expect(within(nav).queryByRole("link", { name: "minwook shin" })).not.toBeInTheDocument();
    expect(within(nav).getByText("Motion Taste System")).toBeInTheDocument();
    expect(within(nav).queryAllByText("studies")).toHaveLength(1);
  });
});
