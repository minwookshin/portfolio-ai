import { PERSONAL_INFO } from "@/data/personal";
import {
  MAIN_PROJECTS,
  getLabProjectPath,
  getLabProjects,
  getProjectPath,
  getProjectMetadataDescription,
  isLabProject,
  orderProjects,
  FEATURED_PROJECT_IDS,
} from "@/data/projects";
import type { PortfolioProject } from "@/data/projects";
import type { WritingPostMeta } from "@/lib/writingTypes";

export const SITE_URL = "https://www.minwookshin.com";
export const SITE_NAME = "Minwook Shin";
export const SITE_DESCRIPTION = PERSONAL_INFO.bio;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type JsonLdNode = Record<string, unknown>;

type CollectionItem = {
  description?: string;
  name: string;
  url: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function toAbsoluteUrl(value?: string) {
  if (!value) return undefined;

  try {
    return new URL(value).toString();
  } catch {
    return absoluteUrl(value);
  }
}

export function rootJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [personJsonLd(), websiteJsonLd()],
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile-page`,
    url: SITE_URL,
    name: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    description: PERSONAL_INFO.bio,
    mainEntity: { "@id": PERSON_ID },
  };
}

export function workCollectionItems() {
  return orderProjects(MAIN_PROJECTS, FEATURED_PROJECT_IDS)
    .filter((project) => !project.comingSoon && !isLabProject(project))
    .map((project) => projectCollectionItem(project, getProjectPath(project)));
}

export function studiesCollectionItems(posts: WritingPostMeta[]) {
  const labItems = getLabProjects().map((project) => projectCollectionItem(project, getLabProjectPath(project)));
  const writingItems = posts.map((post) => ({
    description: post.description,
    name: post.title,
    url: absoluteUrl(`/studies/${post.slug}`),
  }));

  return [...labItems, ...writingItems];
}

export function collectionPageJsonLd({
  description,
  items,
  name,
  url,
}: {
  description: string;
  items: CollectionItem[];
  name: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
        name: item.name,
        description: item.description,
      })),
    },
  };
}

export function projectJsonLd(project: PortfolioProject, path: string) {
  const url = absoluteUrl(path);
  const image = toAbsoluteUrl(project.image ?? project.icon);
  const workExample = toAbsoluteUrl(project.builder.demo?.href ?? project.builder.demo?.video);
  const sameAs = [project.github, project.linkedin, project.link].filter((value): value is string => Boolean(value));
  const creativeWork = {
    "@type": "CreativeWork",
    "@id": `${url}#creative-work`,
    url,
    name: project.title,
    description: getProjectMetadataDescription(project),
    image,
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    dateCreated: project.date,
    keywords: project.tags,
    about: project.categories,
    workExample,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    isPartOf: { "@id": WEBSITE_ID },
  };
  const sourceCode = project.github
    ? {
        "@type": "SoftwareSourceCode",
        "@id": `${url}#source-code`,
        url: project.github,
        name: `${project.title} source code`,
        description: `Public source-code proof for ${project.title}.`,
        codeRepository: project.github,
        programmingLanguage: project.builder.stack,
        creator: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
        isPartOf: { "@id": `${url}#creative-work` },
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [creativeWork, sourceCode].filter(Boolean),
  };
}

export function writingPostJsonLd(post: WritingPostMeta) {
  const url = absoluteUrl(`/studies/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

function personJsonLd(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSONAL_INFO.name,
    url: SITE_URL,
    jobTitle: PERSONAL_INFO.title,
    description: PERSONAL_INFO.bio,
    email: `mailto:${PERSONAL_INFO.email}`,
    sameAs: [PERSONAL_INFO.linkedin, PERSONAL_INFO.github, PERSONAL_INFO.resume],
    knowsAbout: [
      "Design engineering",
      "UX engineering",
      "AI-native interfaces",
      "AI product design",
      "Interaction design",
      "Frontend engineering",
      "React",
      "Next.js",
      "TypeScript",
      "SwiftUI",
      "Framer Motion",
      "Gemini API",
      "Working prototypes",
    ],
  };
}

function websiteJsonLd(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
  };
}

function projectCollectionItem(project: PortfolioProject, path: string): CollectionItem {
  return {
    description: getProjectMetadataDescription(project),
    name: project.title,
    url: absoluteUrl(path),
  };
}
