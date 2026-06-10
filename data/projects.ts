import type { CSSProperties } from "react";
import type { Project } from "@/components/ProjectCard";

export type BuilderMetric = {
  label: string;
  value: string;
  note?: string;
};

export type BuilderDemo = {
  label: string;
  href?: string;
  video?: string;
  note?: string;
};

export type BuilderProof = {
  role: string;
  stack: string[];
  status: {
    label: string;
    href?: string;
  };
  oneLiner: string;
  pipeline: string;
  demo?: BuilderDemo;
  scope: BuilderMetric[];
  results: BuilderMetric[];
};

export type LabStudyKind =
  | "motion-taste"
  | "hover-row"
  | "route-transition"
  | "cursor-study"
  | "motion-curve"
  | "ai-loop";

export type LabStudy = {
  kind: LabStudyKind;
  thesis: string;
  story?: {
    heading: string;
    body: string[];
  }[];
  technicalArtifact?: {
    title: string;
    body: string;
    caption?: string;
  };
  points: string[];
  rules: BuilderMetric[];
  code: string;
};

export type PortfolioProject = Project & {
  slug: string;
  metadataDescription?: string;
  builder: BuilderProof;
  labStudy?: LabStudy;
};

export function hasFillPlaceholder(value: string) {
  return /\{\{FILL(?::[^}]*)?\}\}/.test(value);
}

export function isVisibleBuilderValue(value?: string | null): value is string {
  if (!value?.trim()) return false;
  return !hasFillPlaceholder(value);
}

export function getProjectMetadataDescription(project: PortfolioProject) {
  if (isVisibleBuilderValue(project.metadataDescription)) {
    return project.metadataDescription;
  }

  return [project.builder.oneLiner, project.builder.pipeline]
    .filter(isVisibleBuilderValue)
    .join(" ");
}

export const MAIN_PROJECTS: PortfolioProject[] = [
  {
    id: "1",
    slug: "sentinel",
    title: "Sentinel",
    description: "Predictive Home Maintenance iOS App",
    fullDescription:
      "A native iOS app built in 48 hours that transforms home maintenance from reactive crisis management to proactive risk mitigation. Winner of Google x SCAD FLUX Hackathon 2025.",
    role: "Design Engineer — designed & built",
    timeline: "2 days (48-hour hackathon)",
    team: "Hyunsoo, Madelyn",
    tags: ["Swift", "SwiftUI", "Figma", "Predictive Data"],
    categories: ["Engineering", "Design"],
    github: "https://github.com/minwookshin/sentinel",
    linkedin: "https://www.linkedin.com/posts/minwookshin_hackathon-scadflux-vibecoding-ugcPost-7389656630055018498-BOpk/",
    date: "2025",
    image: "/projects/sentinel/hero.png",
    icon: "/projects/sentinellogo.png",
    studioLabel: "48-hour native iOS MVP",
    themeColor: "#F59E0B",
    overview: "From Idea to Native iOS App in 48 Hours. Sentinel is a predictive home maintenance app that helps homeowners move from gut feeling to data-driven decision making, preventing invisible risks before they become $200,000 disasters.",
    builder: {
      role: "Design Engineer — designed & built",
      stack: ["Figma", "Swift", "SwiftUI", "weather data"],
      status: { label: "Shipped in 48h" },
      oneLiner: "Predictive iOS maintenance app that turns weather risk into prioritized homeowner actions.",
      pipeline: "Designed in Figma → Shipped in Swift + SwiftUI.",
      demo: { label: "Watch demo", video: "/projects/sentinel/demo.mp4" },
      scope: [
        { label: "Build time", value: "48h" },
      ],
      results: [
        { label: "Actual", value: "Winner · Google × SCAD FLUX Hackathon 2025" },
      ],
    },
    contentSections: [
      { type: "text", content: "Hero" },
      { type: "text", content: "Context" },
      { type: "text", content: "Builder Process" },
      { type: "text", content: "Key Features" },
      { type: "text", content: "Demo Video" },
      { type: "text", content: "Outcome" },
    ],
  },
  {
    id: "2",
    slug: "portfolio-ai",
    title: "Portfolio AI",
    description: "An AI-native studio website that explains work, qualifies intent, and routes visitors to the right proof.",
    fullDescription:
      "A conversational product-studio site built with Next.js, React, and Gemini. It answers questions, runs lightweight project intake, and opens relevant case studies in real time.",
    role: "Design Engineer — designed & built solo",
    timeline: "2 weeks",
    team: "Solo Project",
    tags: ["Next.js", "React", "Gemini API", "TypeScript", "Framer Motion"],
    categories: ["Engineering", "AI"],
    github: "https://github.com/minwookshin/portfolio-ai",
    link: "https://www.minwookshin.com",
    date: "2025",
    image: "/projects/2.png",
    icon: "/icon.png",
    studioLabel: "AI intake website",
    themeColor: "#8B5CF6",
    overview: "An AI-native studio site that turns passive browsing into a live project briefing.",
    builder: {
      role: "Design Engineer — designed & built solo",
      stack: ["Next.js", "React", "TypeScript", "Gemini API", "Framer Motion"],
      status: { label: "🟢 Live", href: "https://www.minwookshin.com" },
      oneLiner: "AI-native portfolio that answers questions, qualifies intent, and opens relevant proof.",
      pipeline: "Designed in Figma → Shipped in Next.js + React.",
      demo: {
        label: "Watch demo",
        video: "/projects/portfolio-ai/demo.mp4",
      },
      scope: [
        { label: "Build time", value: "2 weeks" },
        { label: "API integrations", value: "Gemini API, Vercel server routes" },
        { label: "System proof", value: "Tokens, components, AI-readable docs", note: "/design-system" },
      ],
      results: [
        { label: "Actual", value: "Live production site" },
      ],
    },
    features: [
      "Zero-latency streaming using Server-Sent Events (SSE)",
      "3-Layer Defense (Identity Protection, Secret Guard, Injection Firewall)",
      "Rich content rendering with Markdown, Code Blocks, and Project Cards",
    ],
    challenges: "Bridging high-end Product Design with complex LLM Engineering while maintaining military-grade security.",
    outcome: "Bridged the gap between high-end Product Design and complex LLM Engineering. Proves the ability to build secure, production-ready AI applications with elite UX.",
  },
  {
    id: "11",
    slug: "atlas",
    title: "Atlas",
    description: "AI triage communication system for mass-casualty response.",
    fullDescription:
      "A capstone product system for first responders, incident command, and emergency receiving teams during mass-casualty incidents.",
    role: "Design Engineer - product system and prototype",
    timeline: "Capstone, 2026",
    team: "Team Atlas",
    tags: ["AI Triage", "SwiftUI", "Figma", "WebSocket", "Design Systems"],
    categories: ["AI", "Engineering", "Design"],
    date: "2026",
    image: "/projects/atlas/ic-map.png",
    icon: "/projects/atlas/logo.png",
    comingSoon: true,
    unavailableMessage: "Capstone case study in progress.",
    studioLabel: "AI triage command system",
    overview:
      "Atlas coordinates field triage, incident command, and hospital intake through a multi-surface emergency response system.",
    builder: {
      role: "Design Engineer - product system and prototype",
      stack: ["Figma", "SwiftUI", "TypeScript", "WebSocket", "Design tokens"],
      status: { label: "Case study draft" },
      oneLiner: "Multi-surface triage communication system for mass-casualty response.",
      pipeline:
        "Designed in Figma -> prototyped across first-responder mobile, incident-command iPad, emergency-receiving workflows, and a local triage server.",
      scope: [
        { label: "Surfaces", value: "FR mobile, IC iPad, ER intake" },
        { label: "System proof", value: "Design tokens, UI screens, local triage server" },
      ],
      results: [
        { label: "Status", value: "Capstone case study in progress" },
      ],
    },
    gallery: [
      "/projects/atlas/ic-map.png",
      "/projects/atlas/fr-patient-update.png",
      "/projects/atlas/er-queue.png",
      "/projects/atlas/ic-patient-detail.png",
      "/projects/atlas/ic-quick-send.png",
    ],
  },
  {
    id: "4",
    slug: "flux",
    title: "FLUX Website",
    description: "Interactive design project with unique UI interactions",
    fullDescription:
      "A creative web project featuring an innovative grid-based layout with circular elements and dynamic interactions. Built with modern web technologies to create an engaging user experience with smooth animations and responsive design.",
    role: "Website Officer",
    timeline: "2025",
    tags: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
    categories: ["Engineering", "Design"],
    link: "https://www.scadflux.com",
    date: "2025",
    image: "/projects/1.png",
    icon: "/projects/flux/icon-white.png",
    studioLabel: "Interactive web system",
    themeColor: "#8B5CF6",
    overview: "FLUX is a creative web project that showcases innovative UI/UX design through an interactive grid-based layout. The project emphasizes smooth user interactions, dynamic animations, and a unique circular navigation system that creates an engaging browsing experience.",
    builder: {
      role: "Designed & Built as website officer",
      stack: ["HTML", "CSS", "JavaScript"],
      status: { label: "🟢 Live", href: "https://www.scadflux.com" },
      oneLiner: "Interactive event website with grid-based navigation and bespoke motion.",
      pipeline: "Designed in Figma → Shipped in HTML, CSS, and JavaScript.",
      demo: { label: "Open live site", href: "https://www.scadflux.com" },
      scope: [],
      results: [],
    },
  },
  {
    id: "3",
    slug: "mindline",
    title: "Mindline",
    description: "AI-Powered Gambling Addiction Recovery Tool",
    fullDescription:
      "An AI-powered support system designed to help young adults overcome betting addiction through real-time intervention, smart journaling, and behavioral pattern recognition.",
    role: "Product Designer & UX Researcher",
    timeline: "10 weeks",
    team: "Brynn, Giuseppe, Max, Zhenghao, Leo",
    tags: ["AI Chatbot", "UX Research"],
    categories: ["AI", "Design"],
    date: "2025",
    image: "/projects/mindline/hero.png",
    icon: "/projects/mindline/icon.png",
    studioLabel: "Behavioral AI product",
    themeColor: "#3B82F6",
    overview: "Mindline shifts the focus from 'restriction' to 'awareness'. An AI-powered tool that helps young adults (18-26) combat betting addiction through real-time emotional analysis, smart journaling, and behavioral interventions.",
    metadataDescription:
      "Behavioral AI product that turns emotional triggers into real-time intervention — a 10-week research and design sprint targeting young adults.",
    builder: {
      role: "Product Designer & UX Researcher",
      stack: ["Figma", "AI UX flows"],
      status: { label: "Prototype" },
      oneLiner: "Behavioral AI product that turns emotional triggers into real-time intervention.",
      pipeline: "Designed in Figma → prototyped as a research-backed AI UX concept.",
      scope: [
        { label: "Build time", value: "10 weeks" },
      ],
      results: [
        { label: "Actual", value: "6 research interviews" },
      ],
    },
    contentSections: [
      { type: "text", content: "Hero" },
      { type: "text", content: "Research Deep Dive" },
      { type: "text", content: "The Solution" },
      { type: "text", content: "The Logic" },
      { type: "text", content: "Outcome" },
    ],
  },
  {
    id: "17",
    slug: "interface-is-the-loop",
    title: "The Interface Is the Loop",
    description: "A small study on loop engineering for AI interfaces.",
    fullDescription:
      "A lab study for making agent loops visible, steerable, and testable through interface design.",
    tags: ["AI UX", "Agentic Interfaces", "Design Engineering"],
    categories: ["Lab", "AI"],
    date: "2026",
    glyph: "il",
    studioLabel: "ai loop interface",
    metadataDescription:
      "A small AI interface study about loop engineering, traces, evals, and human checkpoints.",
    builder: {
      role: "AI interface study",
      stack: ["React", "Framer Motion", "AI UX"],
      status: { label: "Study" },
      oneLiner: "A small study on loop engineering for AI interfaces.",
      pipeline: "Intent -> trace -> eval -> human checkpoint.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "ai-loop",
      thesis: "AI products get better when the `loop` is visible enough for people to steer it.",
      story: [
        {
          heading: "the starting point",
          body: [
            "Most AI demos hide the loop. The interface jumps from prompt to answer, so the user cannot see the `intent`, the plan, or the moment where the system should slow down.",
          ],
        },
        {
          heading: "setting up the structure",
          body: [
            "I split the loop into readable states: `intent`, `plan`, `action`, `observation`, `eval`, and `checkpoint`. The UI does not need to expose everything, but it should expose enough for the human to steer.",
            "The important part is sequence. A checkpoint should appear before risk, not after the system has already done the work.",
          ],
        },
        {
          heading: "polishing the loop",
          body: [
            "The loop should remember failure. When the same mistake repeats, the interface should turn it into an `eval` instead of another vague retry.",
          ],
        },
      ],
      technicalArtifact: {
        title: "Loop Decision Tree",
        body: `Does the model understand the user's intent?
├── No  -> ask one clarifying question
└── Yes
    ├── Is the next action reversible?
    │   ├── Yes -> act, then observe
    │   └── No  -> checkpoint before action
    │
    ├── Did the same failure repeat?
    │   ├── Yes -> create an eval
    │   └── No  -> retry with better evidence
    │
    └── Is the user still in control?
        ├── Yes -> continue the loop
        └── No  -> surface state + pause`,
        caption: "The loop stays useful when the interface knows when to act, when to ask, and when to stop.",
      },
      points: [
        "Show the system's current `belief` before it turns `intent` into action.",
        "Make the `trace` readable so the human can catch wrong assumptions early.",
        "Turn repeated failures into `evals` instead of treating them as one-off mistakes.",
      ],
      rules: [
        { label: "visible state", value: "`intent`, `plan`, `action`", note: "the user should know what the system thinks it is doing" },
        { label: "checkpoint", value: "before risk", note: "pause before `irreversible` actions, not after them" },
        { label: "eval loop", value: "`failure` -> `test`", note: "good loops remember what went wrong" },
      ],
      code: `const loop = [
  "intent",
  "plan",
  "action",
  "observation",
  "eval",
  "checkpoint",
];

const nextStep = loop.find((step) => needsHumanJudgment(step))
  ?? loop.find((step) => needsMoreEvidence(step))
  ?? "finish";`,
    },
  },
  {
    id: "12",
    slug: "motion-taste-system",
    title: "Motion Taste System",
    description: "A small rulebook for quiet interface motion.",
    fullDescription:
      "A lab study that turns motion taste into reusable rules, durations, easing, and code.",
    tags: ["Motion", "Interaction", "Design Engineering"],
    categories: ["Lab", "Motion"],
    date: "2026",
    glyph: "mt",
    studioLabel: "motion rules and code",
    metadataDescription:
      "A small motion taste system with interactive examples, timing rules, and implementation notes.",
    builder: {
      role: "Interaction study",
      stack: ["Framer Motion", "CSS", "React"],
      status: { label: "Study" },
      oneLiner: "A small rulebook for quiet interface motion.",
      pipeline: "Taste decision -> interactive proof -> reusable code rule.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "motion-taste",
      thesis: "Good motion should explain state change without making the interface feel busy.",
      story: [
        {
          heading: "the starting point",
          body: [
            "The starting point is a control that needs confirmation. If the action happens instantly, it feels risky. If it opens a modal, it feels heavier than the task.",
          ],
        },
        {
          heading: "setting up the structure",
          body: [
            "The button carries two states at once: the normal surface and the confirming surface. The confirming layer is revealed inside the control, so progress stays attached to the user's finger.",
            "That keeps the component small. No dialog, no extra screen, just a visible hold state where the action already lives.",
          ],
        },
        {
          heading: "polishing it up",
          body: [
            "The hold can be slow because it represents intent. The release should be quick because cancellation should feel effortless.",
            "A small `press scale` gives immediate feedback, so the slower confirmation still feels responsive.",
          ],
        },
        {
          heading: "video controls as proof surface",
          body: [
            "The player chrome should appear only when it helps someone inspect the demo. The video stays the proof; the controls sit as a thin translucent layer over moving media.",
            "Glass works here because it improves legibility over changing frames. If it becomes a permanent visual effect, it starts competing with the work.",
          ],
        },
      ],
      technicalArtifact: {
        title: "Easing Decision Flowchart",
        body: `Is the element entering or exiting the viewport?
├── Yes -> ease-out
└── No
    ├── Is it moving or morphing on screen?
    │   ├── Yes -> ease-in-out
    │   └── No
    │       ├── Is it a hover change?
    │       │   ├── Yes -> ease
    │       │   └── No
    │       │
    │       └── Is it constant motion?
    │           ├── Yes -> linear
    │           └── No  -> ease-out`,
        caption: "Choosing motion from a rule keeps the interface quiet instead of leaving every easing to taste.",
      },
      points: [
        "Show progress inside the `control` when the user's input takes time.",
        "Make the commitment slow enough to feel intentional, then make release quick.",
        "Use `press scale` as instant feedback so the slower confirmation still feels responsive.",
      ],
      rules: [
        { label: "press", value: "160ms", note: "instant tactile feedback" },
        { label: "hold", value: "1200ms", note: "sustained intent, linear progress" },
        { label: "release", value: "120-180ms", note: "fast cancellation so it never feels stuck" },
        { label: "video chrome", value: "hover/focus only", note: "mobile stays visible because hover does not exist" },
      ],
      code: `.hold-action {
  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hold-action[data-state="holding"] {
  transform: scale(0.985);
}

.hold-action__overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hold-action[data-state="holding"] .hold-action__overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 1200ms linear;
}`,
    },
  },
  {
    id: "13",
    slug: "hover-row-study",
    title: "Hover Row Study",
    description: "A study for moving project rows without making them loud.",
    fullDescription:
      "A lab study comparing underline, lateral text shift, and preview handoff for project rows.",
    tags: ["Hover", "Interaction", "Portfolio UI"],
    categories: ["Lab", "Interaction"],
    date: "2026",
    glyph: "hr",
    studioLabel: "project-row interaction",
    metadataDescription:
      "A compact hover row interaction study for quiet project browsing.",
    builder: {
      role: "Interaction study",
      stack: ["React", "CSS", "Framer Motion"],
      status: { label: "Study" },
      oneLiner: "A study for moving project rows without making them loud.",
      pipeline: "Compare underline -> lateral copy -> preview handoff.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "hover-row",
      thesis: "The row should respond quickly, but the work should remain the hero.",
      story: [
        {
          heading: "the starting point",
          body: [
            "A project row needs to feel alive without becoming the whole interaction. A heavy underline or big shift makes the list feel louder than the work.",
          ],
        },
        {
          heading: "setting up the handoff",
          body: [
            "The row and the preview should move as one system. The copy shifts a few pixels, while the preview changes quickly enough that the user feels the connection.",
            "The metadata stays quiet until hover. That keeps scanning calm and leaves the title as the primary thing to read.",
          ],
        },
        {
          heading: "polishing the response",
          body: [
            "The movement is intentionally tiny. The goal is not to announce hover; it is to make moving between projects feel continuous.",
          ],
        },
      ],
      technicalArtifact: {
        title: "Hover Handoff Contract",
        body: `Pointer enters a project row
├── Preview changes first       -> 140ms
├── Title shifts slightly       -> 6px / 220ms
├── Metadata becomes readable   -> 220ms color shift
└── Pointer leaves the group
    ├── Keep last preview briefly
    └── Fade only when the user fully exits`,
        caption: "The preview should feel connected to the row without making the row louder than the work.",
      },
      points: [
        "Move copy only a few pixels with `transform`, so the row feels awake, not restless.",
        "Let the `preview` change faster than the text so the image feels connected.",
        "Use muted metadata until hover to keep scanning calm.",
      ],
      rules: [
        { label: "copy move", value: "6px", note: "enough to feel intentional" },
        { label: "preview swap", value: "140ms", note: "fast handoff between projects" },
        { label: "meta color", value: "220ms", note: "secondary copy stays secondary" },
      ],
      code: `.project-row-copy {
  transform: translateX(0);
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

[data-project-row]:hover .project-row-copy {
  transform: translateX(6px);
}`,
    },
  },
  {
    id: "14",
    slug: "route-transition-study",
    title: "Route Transition Study",
    description: "Changing pages without losing the reader's place.",
    fullDescription:
      "A study for routing between work and studies while preserving spatial context.",
    tags: ["Routing", "Motion", "UX"],
    categories: ["Lab", "Interaction"],
    date: "2026",
    glyph: "rt",
    studioLabel: "spatial page transition",
    metadataDescription:
      "A route transition study for changing content below stable identity and navigation.",
    builder: {
      role: "Interaction study",
      stack: ["Next.js", "Framer Motion", "React"],
      status: { label: "Study" },
      oneLiner: "Changing pages without losing the reader's place.",
      pipeline: "Stable identity -> URL change -> content-only transition.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "route-transition",
      thesis: "Navigation feels calmer when identity stays still and only the lower content changes.",
      story: [
        {
          heading: "the starting point",
          body: [
            "The usual page change makes the whole screen feel replaced. On a small portfolio, that is too much motion for switching between `work` and `studies`.",
          ],
        },
        {
          heading: "setting up the structure",
          body: [
            "The identity and navigation stay in place. The `URL` still changes for sharing, but the lower content is the only moving zone.",
            "This makes the route feel like a section change instead of a full restart.",
          ],
        },
        {
          heading: "polishing the transition",
          body: [
            "The content reveal uses a short opacity and y movement. Blur can help bridge the first frame, but it should disappear quickly.",
          ],
        },
      ],
      technicalArtifact: {
        title: "Route Change Contract",
        body: `User changes section
├── Identity changed?
│   ├── Yes -> full route transition
│   └── No  -> keep intro and nav fixed
│
├── URL changed?
│   ├── Yes -> preserve shareable path
│   └── No  -> update local state only
│
└── Content changed?
    ├── Yes -> reveal lower panel
    └── No  -> do nothing`,
        caption: "The page feels calmer when only the part that actually changed is allowed to move.",
      },
      points: [
        "Keep the intro and contact surface stable so the user does not re-orient.",
        "Update the `URL` for shareability without making the whole page feel replaced.",
        "Use a short vertical reveal for content, not a full page animation.",
      ],
      rules: [
        { label: "stable zone", value: "identity + nav", note: "does not animate between sections" },
        { label: "moving zone", value: "content panel", note: "small opacity and y movement" },
        { label: "duration", value: "180ms", note: "uses the fast motion token for content swaps" },
      ],
      code: `<header>
  <a href="/work">minwook shin</a>
  <nav aria-label="sections">
    <a data-active={section === "work"} href="/work">work</a>
    <a data-active={section === "studies"} href="/studies">studies</a>
  </nav>
</header>

<AnimatePresence initial={false}>
  <motion.ul
    key={section}
    initial={{ opacity: 0, y: 7, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
  />
</AnimatePresence>`,
    },
  },
  {
    id: "15",
    slug: "cursor-study",
    title: "Cursor Study",
    description: "A quiet custom cursor that stays behind the work.",
    fullDescription:
      "A lab study for cursor shape, shadow, scale, and when the system cursor should win.",
    tags: ["Cursor", "Interaction", "Micro-detail"],
    categories: ["Lab", "Interaction"],
    date: "2026",
    glyph: "cs",
    studioLabel: "pointer shape study",
    metadataDescription:
      "A cursor interaction study about shape, scale, shadow, and restraint.",
    builder: {
      role: "Interaction study",
      stack: ["SVG", "CSS", "React"],
      status: { label: "Study" },
      oneLiner: "A quiet custom cursor that stays behind the work.",
      pipeline: "Codex-like pointer reference -> reduced shape -> site-specific cursor.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "cursor-study",
      thesis: "A custom cursor should add authorship without stealing attention from the interface.",
      story: [
        {
          heading: "the starting point",
          body: [
            "Custom cursors get annoying fast. The shape has to feel authored, but it should still behave like a normal pointer.",
          ],
        },
        {
          heading: "setting up the shape",
          body: [
            "The cursor keeps the familiar arrow silhouette, then softens it with a smaller size, rounded geometry, and a slight rotation.",
            "The white outline sits outside the black fill, so it separates from dark or busy surfaces without becoming a halo.",
          ],
        },
        {
          heading: "polishing the restraint",
          body: [
            "The custom cursor should back off when precision matters. Text inputs, native controls, and dense UI should keep the system cursor.",
          ],
        },
      ],
      technicalArtifact: {
        title: "Cursor Restraint Contract",
        body: `Is the pointer adding information?
├── No  -> use the system cursor
└── Yes
    ├── Is the surface dense or text-heavy?
    │   ├── Yes -> back off
    │   └── No
    │
    ├── Does contrast need help?
    │   ├── Yes -> outside white outline
    │   └── No  -> black fill only
    │
    └── Is the cursor becoming decorative?
        ├── Yes -> reduce size / shadow
        └── No  -> keep it`,
        caption: "A custom cursor should earn its place; the native cursor wins whenever precision matters.",
      },
      points: [
        "Make the shape slightly rounded so it feels designed, not novelty.",
        "Keep the shadow subtle enough to separate on white without becoming a sticker.",
        "Disable special cursor behavior where `precision` or native affordance matters.",
      ],
      rules: [
        { label: "size", value: "13x15px", note: "smaller than a decorative badge" },
        { label: "rotation", value: "-8deg", note: "lying down slightly, still readable" },
        { label: "outline", value: "outside white", note: "drawn behind the fill so it stays outside the black shape" },
        { label: "shadow", value: "two soft drops", note: "separation without glow" },
      ],
      code: `.animated-cursor__arrow {
  width: 13px;
  height: 15px;
  transform: rotate(-8deg);
  filter:
    drop-shadow(0 1px 1px rgba(0, 0, 0, 0.28))
    drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12));
}

.animated-cursor__outline {
  stroke: rgb(255 255 255);
  stroke-width: 1.6px;
}`,
    },
  },
  {
    id: "16",
    slug: "motion-curve-tester",
    title: "Motion Rule Picker",
    description: "A small study for choosing motion rules already used across the site.",
    fullDescription:
      "A lab study that shows how hover, preview, and route motion rules are chosen for this portfolio.",
    tags: ["Motion", "Design System", "Interaction"],
    categories: ["Lab", "Interaction"],
    date: "2026",
    glyph: "mc",
    studioLabel: "motion rule system",
    metadataDescription:
      "A small motion rule picker for duration, distance, easing, and interaction weight.",
    builder: {
      role: "Interaction study",
      stack: ["React", "Framer Motion"],
      status: { label: "Prototype" },
      oneLiner: "A small rule picker for the motion decisions already used across the site.",
      pipeline: "Define motion rules -> preview the interaction -> apply consistently.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "motion-curve",
      thesis: "Motion should come from a few reusable decisions, not from tweaking sliders until it feels okay.",
      story: [
        {
          heading: "the starting point",
          body: [
            "A motion token by itself does not tell you much. `180ms` can feel crisp for hover feedback and invisible for a larger route change.",
          ],
        },
        {
          heading: "setting up the rules",
          body: [
            "The study shows three production-facing rules: hover, preview handoff, and route entry.",
            "Each rule pairs distance, duration, and easing with the kind of interaction it belongs to.",
            "That makes critique concrete. Instead of inventing a new curve each time, the interface chooses from a small vocabulary.",
          ],
        },
        {
          heading: "polishing the rule",
          body: [
            "The output should be a reusable decision, not just a playground. The best values become small rules for the rest of the site.",
          ],
        },
      ],
      technicalArtifact: {
        title: "Motion Decision Tree",
        body: `What is moving?
├── Hover feedback
│   ├── Token: tweens.fast
│   ├── Duration: 180ms
│   └── Easing: standard
│
├── Preview handoff
│   ├── Token: tweens.base
│   ├── Duration: 250ms
│   └── Easing: standard
│
└── Route or layout entry
    ├── Token: tweens.slowInOut
    ├── Duration: 350ms
    └── Easing: in-out`,
        caption: "Duration only makes sense when it is paired with distance, easing, and interaction weight.",
      },
      points: [
        "Hover feedback should be short enough to disappear into the action.",
        "`standard` easing works for small UI feedback; `in-out` is reserved for larger spatial changes.",
        "A small rule set makes motion critique concrete instead of taste theater.",
      ],
      rules: [
        { label: "hover", value: "180ms", note: "small text and row feedback" },
        { label: "preview", value: "250ms", note: "media and proof handoff" },
        { label: "route", value: "350ms", note: "larger spatial changes" },
      ],
      code: `<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={tweens.base}
/>`,
    },
  },
  {
    id: "7",
    slug: "nameme",
    title: "NameMe",
    description: "Concept design project",
    fullDescription:
      "NameMe is a concept design project spanning ideation, low-fi flows, and a high-fidelity concept.",
    tags: ["UX Design", "Concept"],
    categories: ["Design"],
    date: "2025",
    image: "/projects/nameme/nmmainfin.jpg",
    icon: "/projects/nameme/icon.png",
    studioLabel: "Concept-to-hi-fi UX",
    overview: "From ideation to a high-fidelity concept.",
    gallery: ["/projects/nameme/nmmainfin.jpg", "/projects/nameme/nmhificoncept.png", "/projects/nameme/nmmidfi.png", "/projects/nameme/nmlowfi.png"],
    builder: {
      role: "Product Designer",
      stack: ["Figma"],
      status: { label: "Prototype" },
      oneLiner: "Concept-to-hi-fi product exploration around identity and naming.",
      pipeline: "Designed in Figma → prototyped as a high-fidelity UX concept.",
      scope: [],
      results: [],
    },
  },
  {
    id: "8",
    slug: "capexplorer",
    title: "CapExplorer",
    description: "A website for exploring caps.",
    fullDescription: "CapExplorer, a website for exploring caps.",
    tags: ["Web", "UI/UX Design"],
    categories: ["Engineering", "Design", "AI"],
    date: "2025",
    glyph: "CEr",
    studioLabel: "AI-assisted product demo",
    linkedin: "https://www.linkedin.com/posts/minwookshin_buildinpublic-hat-ugcPost-7432477739208777729-sZlv/",
    builder: {
      role: "Designed & Built solo",
      stack: [],
      status: { label: "Live demo" },
      oneLiner: "Interactive product demo for exploring caps.",
      pipeline: "Designed in Figma → prepared as an interactive product demo.",
      demo: { label: "Watch demo", video: "/projects/capexplorer/demo.mp4" },
      scope: [],
      results: [],
    },
  },
  {
    id: "9",
    slug: "tomo",
    title: "Tomo",
    description: "Tomo, interactive demo.",
    fullDescription: "Tomo, interactive demo.",
    tags: ["Product Design"],
    categories: ["Design", "AI"],
    date: "2025",
    glyph: "🫠",
    studioLabel: "Interactive product demo",
    linkedin: "https://www.linkedin.com/posts/minwookshin_technology-innovation-ugcPost-7432812004098084865-AGvW/",
    builder: {
      role: "Designed & Built solo",
      stack: [],
      status: { label: "Live demo" },
      oneLiner: "Interactive product demo exploration.",
      pipeline: "Designed in Figma → prepared as an interactive product demo.",
      demo: { label: "Watch demo", video: "/projects/tomo/demo.mp4" },
      scope: [],
      results: [],
    },
  },
  {
    id: "10",
    slug: "caret",
    title: "Caret",
    description: "iOS-style team wellbeing app concept exploring burnout signals, presented through a public web prototype.",
    fullDescription:
      "Caret explores how early burnout and quitting signals could surface as team wellbeing cues in an iOS-style experience.",
    metadataDescription:
      "iOS-style team wellbeing app concept exploring burnout signals, presented through a public web prototype.",
    tags: ["Team Wellbeing", "iOS-style UX", "Web Prototype"],
    categories: ["Engineering", "Design"],
    date: "2025",
    icon: "/projects/caret/Caret_icon.png",
    image: "/projects/caret/icon.png",
    studioLabel: "Team wellbeing web prototype",
    github: "https://github.com/minwookshin/caret",
    linkedin: "https://www.linkedin.com/posts/minwookshin_nobody-quits-out-of-nowhere-they-burn-out-ugcPost-7432114646523740160-YWsz/",
    builder: {
      role: "Design Engineer",
      stack: ["Figma", "iOS-style UX", "Web Prototype"],
      status: { label: "Public web prototype" },
      oneLiner: "iOS-style team wellbeing app concept exploring burnout signals, presented through a public web prototype.",
      pipeline: "Designed in Figma for a public web prototype.",
      demo: { label: "Watch demo", video: "/projects/caret/demo.mp4" },
      scope: [],
      results: [],
    },
  },
];

export const FEATURED_PROJECT_IDS = ["11", "1", "2", "3"] as const;
export const LAB_PROJECT_IDS = ["17", "12", "13", "14", "15", "16", "10", "4", "9", "7", "8"] as const;

export const PROJECT_PREVIEW_VIDEOS: Record<string, string> = {
  Sentinel: "/projects/previews/sentinel.mp4",
  "Portfolio AI": "/projects/previews/portfolio-ai.mp4",
  Mindline: "/projects/previews/mindline.mp4",
  "FLUX Website": "/projects/previews/flux.mp4",
  Tomo: "/projects/previews/tomo.mp4",
  NameMe: "/projects/previews/nameme.mp4",
  CapExplorer: "/projects/previews/capexplorer.mp4",
  Caret: "/projects/previews/caret.mp4",
};

export const LIGHT_PROJECT_TOKENS = {
  "--md-surface": "var(--bg-base)",
  "--md-surface-container": "var(--bg-surface)",
  "--md-surface-container-high": "var(--bg-element)",
  "--md-on-surface": "var(--text-primary)",
  "--md-on-surface-variant": "var(--text-muted)",
  "--md-outline": "var(--border-light)",
  "--md-outline-variant": "var(--border-light)",
  "--md-primary": "var(--accent-indigo)",
  "--md-on-primary": "var(--dark-text-primary)",
  "--md-primary-container": "var(--bg-element)",
  "--md-on-primary-container": "var(--text-primary)",
  "--md-hairline": "var(--border-light)",
} as CSSProperties;

export function orderProjects(projects: PortfolioProject[], ids: readonly string[]) {
  return ids
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is PortfolioProject => Boolean(project));
}

export function isFeaturedProject(project: Project) {
  return FEATURED_PROJECT_IDS.includes(project.id as typeof FEATURED_PROJECT_IDS[number]);
}

export function isLabProject(project: Project) {
  return LAB_PROJECT_IDS.includes(project.id as typeof LAB_PROJECT_IDS[number]);
}

export function isLabStudyProject(project: Project | PortfolioProject): project is PortfolioProject & { labStudy: LabStudy } {
  return "labStudy" in project && Boolean(project.labStudy);
}

export function getLabProjects() {
  return orderProjects(MAIN_PROJECTS, LAB_PROJECT_IDS).filter((project) => !project.comingSoon);
}

export function getProjectPath(project: Project) {
  return `/work/${getProjectSlug(project)}`;
}

export function getLabProjectPath(project: Project) {
  if (getProjectSlug(project) === "caret") return getProjectPath(project);
  return `/studies/${getProjectSlug(project)}`;
}

export function getProjectBySlug(slug: string) {
  return MAIN_PROJECTS.find((project) => project.slug === slug);
}

export function getOpenableProjects() {
  return MAIN_PROJECTS.filter((project) => !project.comingSoon);
}

function slugifyProjectTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getProjectSlug(project: Project) {
  return "slug" in project && typeof project.slug === "string" ? project.slug : slugifyProjectTitle(project.title);
}
