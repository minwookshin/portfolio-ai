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
