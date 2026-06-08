import type { MetadataRoute } from "next";
import { MAIN_PROJECTS, getLabProjects, isLabProject } from "@/data/projects";
import { absoluteUrl } from "@/lib/seo";
import { getWritingPosts } from "@/lib/writing";

function parsedDate(value?: string) {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const workProjects = MAIN_PROJECTS.filter((project) => !project.comingSoon && !isLabProject(project));
  const labProjects = getLabProjects();
  const writingPosts = getWritingPosts();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/work"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/studies"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...workProjects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: parsedDate(project.date) ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...labProjects.map((project) => ({
      url: absoluteUrl(`/studies/${project.slug}`),
      lastModified: parsedDate(project.date) ?? now,
      changeFrequency: "monthly" as const,
      priority: project.labStudy ? 0.75 : 0.65,
    })),
    ...writingPosts.map((post) => ({
      url: absoluteUrl(`/writing/${post.slug}`),
      lastModified: parsedDate(post.date) ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
