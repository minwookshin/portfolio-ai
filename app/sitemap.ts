import type { MetadataRoute } from "next";
import { MAIN_PROJECTS, getLabProjectPath, getLabProjects, getProjectPath, isLabProject } from "@/data/projects";
import { getStudyMarkdownSlugs, getWorkMarkdownSlugs } from "@/lib/aiPortfolio";
import { DESIGN_SYSTEM_PATHS } from "@/lib/designSystemProof";
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
    {
      url: absoluteUrl("/portfolio.md"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/llms.txt"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/resume.json"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/resume.pdf"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: absoluteUrl(DESIGN_SYSTEM_PATHS.page),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: absoluteUrl(DESIGN_SYSTEM_PATHS.markdown),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl(DESIGN_SYSTEM_PATHS.tokens),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.45,
    },
    ...workProjects.map((project) => ({
      url: absoluteUrl(getProjectPath(project)),
      lastModified: parsedDate(project.date) ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...labProjects.map((project) => ({
      url: absoluteUrl(getLabProjectPath(project)),
      lastModified: parsedDate(project.date) ?? now,
      changeFrequency: "monthly" as const,
      priority: project.labStudy ? 0.75 : 0.65,
    })),
    ...writingPosts.map((post) => ({
      url: absoluteUrl(`/studies/${post.slug}`),
      lastModified: parsedDate(post.date) ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getWorkMarkdownSlugs().map((slug) => ({
      url: absoluteUrl(`/work/${slug}.md`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...getStudyMarkdownSlugs().map((slug) => ({
      url: absoluteUrl(`/studies/${slug}.md`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
