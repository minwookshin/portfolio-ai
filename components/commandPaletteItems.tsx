import type { ReactNode } from "react";
import {
  ArrowDown,
  Briefcase,
  Copy,
  FileText,
  Hash,
  Keyboard,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  NotebookText,
} from "lucide-react";
import {
  FEATURED_PROJECT_IDS,
  MAIN_PROJECTS,
  getLabProjectPath,
  getProjectBySlug,
  getProjectPath,
  isLabProject,
  orderProjects,
} from "@/data/projects";
import type { PortfolioProject } from "@/data/projects";
import { PERSONAL_INFO } from "@/data/personal";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { formatWritingDate } from "@/lib/writingDisplay";
import type { WritingPostMeta } from "@/lib/writingTypes";

export type CommandPreview = {
  body: string;
  meta?: string;
  title: string;
};

export type CommandItem = {
  action: () => void;
  group: string;
  icon: ReactNode;
  id: string;
  keywords: string[];
  meta: string;
  preview?: CommandPreview;
  title: string;
};

type BuildCommandItemsOptions = {
  askAboutPortfolio: () => void;
  contextLabel: string;
  copyText: (value: string, label: string) => void | Promise<void>;
  currentProject: PortfolioProject | null;
  jumpToId: (id: string, href: string) => void;
  openShortcuts: () => void;
  pathname: string;
  push: (href: string) => void;
  writingPosts: WritingPostMeta[];
};

export function normalizeCommandText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getCurrentProject(pathname: string) {
  const match = pathname.match(/^\/work\/([^/?#]+)/);
  if (!match?.[1]) return null;
  return getProjectBySlug(decodeURIComponent(match[1])) ?? null;
}

export function getCurrentContext(pathname: string, project: PortfolioProject | null) {
  if (pathname === "/") return "index";
  if (pathname === "/work") return "work";
  if (pathname === "/notes") return "notes";
  if (pathname === "/studies") return "studies";
  if (project) return project.title.toLowerCase();
  if (pathname.startsWith("/interactions")) return "interactions";
  return "portfolio";
}

function projectDescriptor(project: PortfolioProject) {
  const descriptor = project.studioLabel ?? project.description;
  return [project.date, descriptor].filter(Boolean).join(" / ");
}

function projectPreview(project: PortfolioProject): CommandPreview {
  return {
    title: project.title.toLowerCase(),
    meta: projectDescriptor(project),
    body: project.builder.oneLiner || project.fullDescription || project.description,
  };
}

function notePreview(post: WritingPostMeta): CommandPreview {
  return {
    title: post.title,
    meta: formatWritingDate(post.date),
    body: post.description,
  };
}

function getCommandLink(path: string) {
  return absoluteUrl(path);
}

function atlasJumpCommands(jumpToId: (id: string, href: string) => void): CommandItem[] {
  return [
    {
      id: "atlas-proof-bento",
      title: "jump to proof bento",
      meta: "atlas artifact",
      group: "atlas",
      keywords: ["atlas", "proof", "bento", "case study"],
      icon: <Hash />,
      preview: {
        title: "proof bento grid",
        meta: "atlas",
        body: "Moves to the proof grid: sequence, live state, patient detail, code artifact, motion rule, and decision log.",
      },
      action: () => jumpToId("atlas-proof-bento", "/work/atlas#atlas-proof-bento"),
    },
    {
      id: "atlas-triage-map",
      title: "jump to triage map",
      meta: "incident command flow",
      group: "atlas",
      keywords: ["atlas", "triage", "map", "incident", "command"],
      icon: <Hash />,
      preview: {
        title: "triage map",
        meta: "incident command flow",
        body: "A screenshot sequence for field, command, and receiving surfaces sharing one emergency picture.",
      },
      action: () => jumpToId("atlas-triage-map", "/work/atlas#atlas-triage-map"),
    },
    {
      id: "atlas-capacity-state",
      title: "jump to capacity state",
      meta: "live interaction",
      group: "atlas",
      keywords: ["atlas", "capacity", "slider", "hospital", "load"],
      icon: <Hash />,
      preview: {
        title: "capacity state",
        meta: "live interaction",
        body: "A compact state model for hospital load, beds, priority, and next routing action.",
      },
      action: () => jumpToId("atlas-capacity-state", "/work/atlas#atlas-capacity-state"),
    },
    {
      id: "atlas-event-contract",
      title: "jump to event contract",
      meta: "code artifact",
      group: "atlas",
      keywords: ["atlas", "event", "contract", "code", "websocket"],
      icon: <Hash />,
      preview: {
        title: "event contract",
        meta: "code artifact",
        body: "The small shared vocabulary that lets every app surface read the same patient-state events.",
      },
      action: () => jumpToId("atlas-event-contract", "/work/atlas#atlas-event-contract"),
    },
    {
      id: "atlas-decision-log",
      title: "jump to decision log",
      meta: "role / constraint / result",
      group: "atlas",
      keywords: ["atlas", "decision", "log", "role", "constraint", "outcome"],
      icon: <Hash />,
      preview: {
        title: "decision log",
        meta: "context",
        body: "The short hiring-readable layer for role, constraint, decision, and result.",
      },
      action: () => jumpToId("atlas-decision-log", "/work/atlas#atlas-decision-log"),
    },
  ];
}

export function buildCommandItems({
  askAboutPortfolio,
  contextLabel,
  copyText,
  currentProject,
  jumpToId,
  openShortcuts,
  pathname,
  push,
  writingPosts,
}: BuildCommandItemsOptions): CommandItem[] {
  const featuredProjects = orderProjects(MAIN_PROJECTS, FEATURED_PROJECT_IDS).filter((project) => !project.comingSoon);
  const openProjects = MAIN_PROJECTS.filter((project) => !project.comingSoon);
  const orderedProjects = [
    ...featuredProjects,
    ...openProjects.filter((project) => !featuredProjects.some((featured) => featured.id === project.id)),
  ];
  const latestNote = writingPosts[0];
  const currentUrl = getCommandLink(pathname);
  const currentSummary = currentProject
    ? `${currentProject.title}: ${currentProject.builder.oneLiner || currentProject.fullDescription || currentProject.description}`
    : "minwook shin makes interfaces, prototypes, and small systems for AI-native products.";
  const contextCommands: CommandItem[] = [
    ...(currentProject?.slug === "atlas" ? atlasJumpCommands(jumpToId) : []),
    ...(pathname !== "/"
      ? [
          {
            id: "view-index",
            title: "view index",
            meta: "outline os",
            group: "navigate",
            keywords: ["home", "index", "outline"],
            icon: <ArrowDown />,
            preview: {
              title: "index",
              meta: "outline os",
              body: "Return to the text-based operating layer: today, work, notes, and contact.",
            },
            action: () => push("/"),
          },
        ]
      : [
          {
            id: "jump-today",
            title: "jump to today",
            meta: "home section",
            group: "index",
            keywords: ["today", "now", "section"],
            icon: <Hash />,
            preview: {
              title: "today",
              meta: "index section",
              body: "The current working state of the portfolio.",
            },
            action: () => jumpToId("today", "/#today"),
          },
          {
            id: "jump-contact",
            title: "jump to contact",
            meta: "links and email",
            group: "index",
            keywords: ["contact", "email", "linkedin", "github"],
            icon: <Hash />,
            preview: {
              title: "contact",
              meta: "index section",
              body: "LinkedIn, GitHub, X, email, and resume actions.",
            },
            action: () => jumpToId("contact", "/#contact"),
          },
        ]),
    ...(pathname === "/work"
      ? [
          {
            id: "jump-work-2026",
            title: "jump to 2026",
            meta: "work year",
            group: "work",
            keywords: ["work", "2026", "atlas"],
            icon: <Hash />,
            preview: {
              title: "2026",
              meta: "work archive",
              body: "The newest work group, currently anchored by Atlas.",
            },
            action: () => jumpToId("year-2026", "/work#year-2026"),
          },
          {
            id: "jump-work-2025",
            title: "jump to 2025",
            meta: "work year",
            group: "work",
            keywords: ["work", "2025", "sentinel", "portfolio ai", "mindline"],
            icon: <Hash />,
            preview: {
              title: "2025",
              meta: "work archive",
              body: "Sentinel, Portfolio AI, Mindline, and small project proofs.",
            },
            action: () => jumpToId("year-2025", "/work#year-2025"),
          },
        ]
      : []),
    ...(currentProject
      ? [
          {
            id: "copy-project-link",
            title: `copy ${currentProject.title.toLowerCase()} link`,
            meta: "current page",
            group: "copy",
            keywords: ["copy", currentProject.title, "link", "url"],
            icon: <Copy />,
            preview: projectPreview(currentProject),
            action: () => void copyText(currentUrl, "project link"),
          },
          {
            id: "copy-project-summary",
            title: `copy ${currentProject.title.toLowerCase()} summary`,
            meta: "one line",
            group: "copy",
            keywords: ["copy", currentProject.title, "summary", "one liner"],
            icon: <Copy />,
            preview: {
              title: "project summary",
              meta: currentProject.title.toLowerCase(),
              body: currentSummary,
            },
            action: () => void copyText(currentSummary, "project summary"),
          },
        ]
      : [
          {
            id: "copy-current-link",
            title: "copy current link",
            meta: contextLabel,
            group: "copy",
            keywords: ["copy", "link", "url", "current"],
            icon: <Copy />,
            preview: {
              title: "current link",
              meta: contextLabel,
              body: currentUrl,
            },
            action: () => void copyText(currentUrl, "link"),
          },
        ]),
  ];

  return [
    ...contextCommands,
    {
      id: "view-work",
      title: "view work",
      meta: "proof log",
      group: "navigate",
      keywords: ["projects", "archive", "work"],
      icon: <Briefcase />,
      preview: {
        title: "work",
        meta: `${openProjects.length} projects`,
        body: "Selected product systems, AI-native interfaces, and working prototypes organized by year.",
      },
      action: () => push("/work"),
    },
    {
      id: "view-notes",
      title: "view notes",
      meta: "thinking log",
      group: "navigate",
      keywords: ["writing", "notes", "thinking"],
      icon: <NotebookText />,
      preview: {
        title: "notes",
        meta: `${writingPosts.length} note${writingPosts.length === 1 ? "" : "s"}`,
        body: "Short thinking log entries on code, design, motion, and the practice.",
      },
      action: () => push("/notes"),
    },
    ...orderedProjects.map((project) => ({
      id: `project-${project.slug ?? project.id}`,
      title: `open ${project.title.toLowerCase()}`,
      meta: projectDescriptor(project),
      group: "work",
      keywords: [project.title, project.description, project.studioLabel ?? "", project.date ?? ""],
      icon: <FileText />,
      preview: projectPreview(project),
      action: () => push(isLabProject(project) ? getLabProjectPath(project) : getProjectPath(project)),
    })),
    ...(latestNote
      ? [
          {
            id: `note-${latestNote.slug}`,
            title: `open ${latestNote.title}`,
            meta: formatWritingDate(latestNote.date),
            group: "notes",
            keywords: [latestNote.title, latestNote.description, "writing", "notes"],
            icon: <NotebookText />,
            preview: notePreview(latestNote),
            action: () => push(`/notes/${latestNote.slug}`),
          },
        ]
      : []),
    {
      id: "copy-email",
      title: "copy email",
      meta: PERSONAL_INFO.email,
      group: "copy",
      keywords: ["contact", "mail", "email", "reach"],
      icon: <Mail />,
      preview: {
        title: "email",
        meta: "contact",
        body: PERSONAL_INFO.email,
      },
      action: () => void copyText(PERSONAL_INFO.email, "email"),
    },
    {
      id: "copy-short-bio",
      title: "copy short bio",
      meta: "one line",
      group: "copy",
      keywords: ["bio", "about", "summary", "copy"],
      icon: <Copy />,
      preview: {
        title: "short bio",
        meta: "copy utility",
        body: "Minwook Shin makes interfaces, prototypes, and small systems for AI-native products.",
      },
      action: () => void copyText("Minwook Shin makes interfaces, prototypes, and small systems for AI-native products.", "bio"),
    },
    {
      id: "copy-portfolio-link",
      title: "copy portfolio link",
      meta: SITE_URL.replace("https://", ""),
      group: "copy",
      keywords: ["portfolio", "copy", "site", "url"],
      icon: <LinkIcon />,
      preview: {
        title: "portfolio link",
        meta: "copy utility",
        body: SITE_URL,
      },
      action: () => void copyText(SITE_URL, "portfolio link"),
    },
    {
      id: "copy-resume-link",
      title: "copy resume link",
      meta: "pdf",
      group: "copy",
      keywords: ["resume", "cv", "copy", "pdf"],
      icon: <LinkIcon />,
      preview: {
        title: "resume link",
        meta: "copy utility",
        body: getCommandLink(PERSONAL_INFO.resume),
      },
      action: () => void copyText(getCommandLink(PERSONAL_INFO.resume), "resume link"),
    },
    {
      id: "open-resume",
      title: "open resume",
      meta: "pdf",
      group: "contact",
      keywords: ["cv", "profile", "resume"],
      icon: <FileText />,
      preview: {
        title: "resume",
        meta: "contact",
        body: "Open the resume PDF in the browser.",
      },
      action: () => push(PERSONAL_INFO.resume),
    },
    {
      id: "ask-portfolio",
      title: "ask about this portfolio",
      meta: "ai utility",
      group: "ask",
      keywords: ["ai", "assistant", "question", "portfolio"],
      icon: <MessageCircle />,
      preview: {
        title: "ask about this portfolio",
        meta: "ai utility",
        body: "Opens the existing portfolio assistant as one command, not as the whole interface.",
      },
      action: askAboutPortfolio,
    },
    {
      id: "show-shortcuts",
      title: "show shortcuts",
      meta: "keyboard",
      group: "system",
      keywords: ["keyboard", "shortcuts", "help", "question mark"],
      icon: <Keyboard />,
      preview: {
        title: "shortcuts",
        meta: "small overlay",
        body: "A tiny reference for the portfolio OS controls.",
      },
      action: openShortcuts,
    },
  ];
}
