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
  defaultVisible?: boolean;
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
  copyText: (value: string, label: string, options?: { notify?: boolean }) => boolean | void | Promise<boolean | void>;
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

function getCurrentNote(pathname: string, writingPosts: WritingPostMeta[]) {
  const match = pathname.match(/^\/(?:notes|writing)\/([^/?#]+)/);
  if (!match?.[1]) return null;
  const slug = decodeURIComponent(match[1]);
  return writingPosts.find((post) => post.slug === slug) ?? null;
}

export function getCurrentContext(
  pathname: string,
  project: PortfolioProject | null,
  writingPosts: WritingPostMeta[] = [],
) {
  if (pathname === "/") return "index";
  if (pathname === "/work") return "work";
  if (pathname === "/notes") return "notes";
  if (pathname === "/writing") return "writing";
  if (pathname === "/studies") return "studies";
  if (project) return project.title.toLowerCase();
  const note = getCurrentNote(pathname, writingPosts);
  if (note) return "note";
  if (pathname.startsWith("/lab")) return "lab";
  if (pathname.startsWith("/interactions")) return "interactions";
  if (pathname.startsWith("/design-system")) return "design system";
  return "portfolio";
}

export function getCommandSearchPlaceholder(
  pathname: string,
  project: PortfolioProject | null,
  writingPosts: WritingPostMeta[] = [],
) {
  const note = getCurrentNote(pathname, writingPosts);
  if (project) return `search ${project.title.toLowerCase()} commands`;
  if (note) return "search note commands";
  return `search ${getCurrentContext(pathname, project, writingPosts)} commands`;
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

function getProjectCommandId(project: PortfolioProject) {
  return `project-${project.slug ?? project.id}`;
}

function atlasContextCommands({
  jumpToId,
}: {
  jumpToId: (id: string, href: string) => void;
}): CommandItem[] {
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
      id: "atlas-patient-detail",
      title: "jump to patient detail",
      meta: "scan density",
      group: "atlas",
      keywords: ["atlas", "patient", "detail", "scan", "density"],
      icon: <Hash />,
      preview: {
        title: "patient detail",
        meta: "scan density",
        body: "Moves to the dense patient data proof tile.",
      },
      action: () => jumpToId("atlas-patient-detail", "/work/atlas#atlas-patient-detail"),
    },
    {
      id: "atlas-motion-rule",
      title: "jump to motion rule",
      meta: "live interaction",
      group: "atlas",
      keywords: ["atlas", "motion", "rule", "interaction", "state"],
      icon: <Hash />,
      preview: {
        title: "motion rule",
        meta: "live interaction",
        body: "Moves to the proof tile for restrained emergency UI motion.",
      },
      action: () => jumpToId("atlas-motion-rule", "/work/atlas#atlas-motion-rule"),
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
    {
      id: "atlas-reflection",
      title: "jump to reflection",
      meta: "next iteration",
      group: "atlas",
      keywords: ["atlas", "reflection", "next", "iteration", "learned"],
      icon: <Hash />,
      preview: {
        title: "short reflection",
        meta: "next iteration",
        body: "Moves to the note about making the next system log inspectable.",
      },
      action: () => jumpToId("atlas-reflection", "/work/atlas#atlas-reflection"),
    },
  ];
}

function prioritizeCommandItems(items: CommandItem[], preferredIds: string[]) {
  const preferred = preferredIds.filter(Boolean);
  const order = new Map(preferred.map((id, index) => [id, index]));
  const defaultVisible = new Set(preferred);

  return items
    .map((item, index) => ({
      index,
      item,
      priority: order.get(item.id) ?? Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.priority - b.priority || a.index - b.index)
    .map(({ item }) => ({
      ...item,
      defaultVisible: defaultVisible.has(item.id),
    }));
}

function getPreferredCommandIds({
  currentProject,
  latestNote,
  orderedProjects,
  pathname,
}: {
  currentProject: PortfolioProject | null;
  latestNote?: WritingPostMeta;
  orderedProjects: PortfolioProject[];
  pathname: string;
}) {
  if (pathname === "/") {
    return [
      "view-work",
      "view-notes",
      "copy-email",
      "ask-portfolio",
      "jump-today",
      "jump-contact",
      "copy-current-link",
    ];
  }

  if (pathname === "/work") {
    return [
      ...orderedProjects.slice(0, 4).map(getProjectCommandId),
      "copy-current-link",
      "jump-work-2026",
      "jump-work-2025",
      "view-index",
    ];
  }

  if (pathname === "/notes") {
    return [
      latestNote ? `note-${latestNote.slug}` : "",
      "copy-current-link",
      "view-index",
      "view-work",
    ];
  }

  if (pathname.startsWith("/notes/") || pathname.startsWith("/writing/")) {
    return [
      "copy-current-link",
      "view-notes",
      "view-index",
      "view-work",
    ];
  }

  if (currentProject?.slug === "atlas") {
    return [
      "atlas-proof-bento",
      "atlas-capacity-state",
      "atlas-event-contract",
      "atlas-decision-log",
      "view-work",
      "view-index",
    ];
  }

  if (currentProject) {
    return [
      "view-work",
      "view-index",
      "view-notes",
      "ask-portfolio",
    ];
  }

  if (pathname.startsWith("/interactions")) {
    return [
      "copy-current-link",
      "view-index",
      "show-shortcuts",
      "view-work",
    ];
  }

  return [
    "view-index",
    "copy-current-link",
    "view-work",
    "view-notes",
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
  const contextCommands: CommandItem[] = [
    ...(currentProject?.slug === "atlas" ? atlasContextCommands({ jumpToId }) : []),
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
            keywords: ["work", "2025", "sentinel", "portfolio ai", "flux", "caret", "mindline", "capexplorer", "tomo", "nameme"],
            icon: <Hash />,
            preview: {
              title: "2025",
              meta: "work archive",
              body: "Sentinel, Portfolio AI, FLUX Website, Caret, Mindline, CapExplorer, Tomo, and NameMe.",
            },
            action: () => jumpToId("year-2025", "/work#year-2025"),
          },
        ]
      : []),
    ...(!currentProject
      ? [
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
        ]
      : []),
  ];

  const commandItems: CommandItem[] = [
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
      id: getProjectCommandId(project),
      title: project.title.toLowerCase(),
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
            title: latestNote.title,
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
        body: "Minwook Shin designs and builds interfaces for AI native products.",
      },
      action: () => void copyText("Minwook Shin designs and builds interfaces for AI native products.", "bio"),
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
      title: "resume",
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

  return prioritizeCommandItems(commandItems, getPreferredCommandIds({
    currentProject,
    latestNote,
    orderedProjects,
    pathname,
  }));
}
