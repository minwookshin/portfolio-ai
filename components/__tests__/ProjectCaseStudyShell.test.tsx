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

describe("ProjectCaseStudyShell", () => {
  it("renders work detail breadcrumbs as direct links", () => {
    render(<ProjectCaseStudyShell project={getWorkProject("sentinel")} />);

    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(within(nav).getByRole("link", { name: "minwook shin" })).toHaveAttribute("href", "/work");
    expect(within(nav).getByRole("link", { name: "work" })).toHaveAttribute("href", "/work");
    expect(within(nav).getByText("Sentinel")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Play video" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Sentinel demo timeline" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unmute video" })).toBeInTheDocument();
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

  it("renders study detail breadcrumbs in page order", () => {
    render(
      <ProjectCaseStudyShell
        project={getStudyProject("motion-taste-system")}
        baseHref="/studies"
        variant="lab"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(within(nav).getByRole("link", { name: "minwook shin" })).toHaveAttribute("href", "/work");
    expect(within(nav).getByRole("link", { name: "studies" })).toHaveAttribute("href", "/studies");
    expect(within(nav).getByText("Motion Taste System")).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryAllByText("studies")).toHaveLength(1);
  });
});
