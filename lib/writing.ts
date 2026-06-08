import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getProjectBySlug } from "@/data/projects";
import type { WritingPost, WritingPostMeta } from "@/lib/writingTypes";

const WRITING_DIRECTORY = path.join(process.cwd(), "content", "writing");
const POST_EXTENSION = ".mdx";

type RawFrontmatter = {
  date?: unknown;
  description?: unknown;
  relatedWork?: unknown;
  title?: unknown;
};

export type RelatedWorkLink = {
  href: string;
  slug: string;
  title: string;
};

function readPostFile(slug: string) {
  const filePath = path.join(WRITING_DIRECTORY, `${slug}${POST_EXTENSION}`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

function getPostSlugs() {
  if (!fs.existsSync(WRITING_DIRECTORY)) return [];

  return fs
    .readdirSync(WRITING_DIRECTORY)
    .filter((file) => file.endsWith(POST_EXTENSION))
    .map((file) => file.replace(POST_EXTENSION, ""));
}

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return normalizeString(value);
}

function normalizeRelatedWork(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function parsePost(slug: string): WritingPost | null {
  const source = readPostFile(slug);
  if (!source) return null;

  const { content, data } = matter(source);
  const frontmatter = data as RawFrontmatter;
  const title = normalizeString(frontmatter.title, slug);
  const description = normalizeString(frontmatter.description, "Writing note.");
  const date = normalizeDate(frontmatter.date);

  return {
    content,
    date,
    description,
    relatedWork: normalizeRelatedWork(frontmatter.relatedWork),
    slug,
    title,
  };
}

function sortNewestFirst(posts: WritingPostMeta[]) {
  return [...posts].sort((a, b) => {
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);
    if (Number.isNaN(aTime) || Number.isNaN(bTime)) return a.title.localeCompare(b.title);
    return bTime - aTime;
  });
}

export function getWritingPosts() {
  return sortNewestFirst(
    getPostSlugs()
      .map((slug) => parsePost(slug))
      .filter((post): post is WritingPost => Boolean(post))
  );
}

export function getLatestWritingPosts(limit = 2) {
  return getWritingPosts().slice(0, limit);
}

export function getWritingPost(slug: string) {
  return parsePost(slug);
}

export function getWritingPostsByWorkSlug() {
  const postsByWorkSlug = new Map<string, WritingPostMeta[]>();

  for (const post of getWritingPosts()) {
    for (const workSlug of post.relatedWork) {
      const posts = postsByWorkSlug.get(workSlug) ?? [];
      posts.push(post);
      postsByWorkSlug.set(workSlug, posts);
    }
  }

  return postsByWorkSlug;
}

export function getWritingPostsForWork(workSlug: string) {
  return getWritingPostsByWorkSlug().get(workSlug) ?? [];
}

export function getRelatedWorkLinks(post: WritingPost): RelatedWorkLink[] {
  return post.relatedWork
    .map((slug) => {
      const project = getProjectBySlug(slug);
      if (!project || project.comingSoon) return null;
      return {
        href: `/work/${project.slug}`,
        slug,
        title: project.title,
      };
    })
    .filter((link): link is RelatedWorkLink => Boolean(link));
}
