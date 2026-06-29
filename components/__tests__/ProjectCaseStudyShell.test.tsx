import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
  it("renders work detail navigation as a quiet back link", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("sentinel")} />);

    const nav = screen.getByRole("navigation", { name: "Sentinel navigation" });
    expect(within(nav).getByRole("link", { name: "back to work" })).toHaveAttribute("href", "/work");
    expect(within(nav).getByRole("button", { name: "copy Sentinel page link" })).toBeInTheDocument();
    expect(within(nav).queryByRole("link", { name: "minwook shin" })).not.toBeInTheDocument();
    expect(within(nav).queryByText("Sentinel")).not.toBeInTheDocument();
    expect(screen.getByText("ownership")).toBeInTheDocument();
    expect(screen.getByText("public repo / demo video / public post")).toBeInTheDocument();
    expect(screen.getByText("build path")).toBeInTheDocument();
    expectNativeVideo("Sentinel demo");
  });

  it("does not duplicate video-only demos in proof links", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("caret")} />);

    expect(screen.queryByRole("link", { name: /watch demo/i })).not.toBeInTheDocument();
    expect(screen.getByText("links")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/minwookshin/caret");
    expect(screen.getByText("/ source")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/posts/minwookshin_nobody-quits-out-of-nowhere-they-burn-out-ugcPost-7432114646523740160-YWsz/",
    );
    expect(screen.getByText("/ post")).toBeInTheDocument();
  });

  it("renders small work in video-only mode", () => {
    render(<ProjectCaseStudyShell mode="video-only" project={getWorkProject("tomo")} />);

    expect(screen.getByRole("heading", { name: "Tomo" })).toBeInTheDocument();
    expectNativeVideo("Tomo demo");
    expect(screen.queryByText("links")).not.toBeInTheDocument();
    expect(screen.queryByText("build path")).not.toBeInTheDocument();
  });

  it("renders Portfolio AI proof links as working public routes", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("portfolio-ai")} />);

    expect(screen.queryByRole("link", { name: /try live site/i })).not.toBeInTheDocument();
    expect(screen.getByText("public repo / live site")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /video/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Design system proof" })).toHaveAttribute("href", "/design-system");
    expect(screen.getByRole("link", { name: "Design system markdown" })).toHaveAttribute("href", "/design-system.md");
    expect(screen.getByRole("link", { name: "Design tokens JSON" })).toHaveAttribute("href", "/design-system/tokens.json");
    expect(screen.getByText("/ page")).toBeInTheDocument();
    expect(screen.getByText("/ markdown")).toBeInTheDocument();
    expect(screen.getByText("/ json")).toBeInTheDocument();
  });

  it("renders Atlas as a proof-led case study template", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("atlas")} />);

    expect(screen.getByRole("heading", { name: "atlas / 2026 / ai triage prototype system" })).toBeInTheDocument();
    expect(screen.getByText("proof bento grid")).toBeInTheDocument();
    expect(screen.getByLabelText("hospital load")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "advance state" })).toBeInTheDocument();
    expect(screen.getAllByText("event contract")).toHaveLength(2);
    expect(screen.getByText("case-study sketch")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "copy capacity state section link" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "copy event contract artifact" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "copy event contract section link" })).toBeInTheDocument();
    expect(screen.getByText("server.broadcast(event);")).toBeInTheDocument();
  });

  it("renders study detail navigation as a quiet back link", () => {
    render(
      <ProjectCaseStudyShell
        project={getStudyProject("motion-taste-system")}
        baseHref="/studies"
        variant="lab"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Motion Taste System navigation" });
    expect(within(nav).getByRole("link", { name: "back to studies" })).toHaveAttribute("href", "/studies");
    expect(within(nav).queryByRole("link", { name: "minwook shin" })).not.toBeInTheDocument();
    expect(within(nav).queryByText("Motion Taste System")).not.toBeInTheDocument();
    expect(within(nav).queryAllByText("studies")).toHaveLength(1);
  });
});
