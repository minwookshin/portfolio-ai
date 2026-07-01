"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DetailOutlineHeading, DetailOutlineRow } from "@/components/Outline";
import StudioVideoPlayer from "@/components/StudioVideoPlayer";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { tweens } from "@/lib/material/motion";
import type { PortfolioProject } from "@/data/projects";

type ArtifactMeta = {
  label: "role" | "constraint" | "decision" | "outcome";
  value: string;
};

type ArtifactImage = {
  alt: string;
  label: string;
  src: string;
};

type ArtifactTile =
  | {
      caption: string;
      className: string;
      id: string;
      images: ArtifactImage[];
      label: string;
      title: string;
      type: "sequence";
    }
  | {
      caption: string;
      className: string;
      id: string;
      label: string;
      src: string;
      title: string;
      type: "video";
    }
  | {
      caption: string;
      className: string;
      id: string;
      images: ArtifactImage[];
      label: string;
      title: string;
      type: "gallery";
    }
  | {
      caption: string;
      className: string;
      id: string;
      label: string;
      live: "sentinel-risk" | "portfolio-router" | "mindline-loop";
      title: string;
      type: "live";
    }
  | {
      caption: string;
      className: string;
      code: string;
      id: string;
      label: string;
      title: string;
      type: "code";
    }
  | {
      caption: string;
      className: string;
      id: string;
      label: string;
      links: { href: string; label: string; meta: string }[];
      title: string;
      type: "links";
    }
  | {
      caption: string;
      className: string;
      id: string;
      label: string;
      rows: { label: string; value: string }[];
      title: string;
      type: "log";
    };

type ArtifactCase = {
  body: string;
  meta: ArtifactMeta[];
  reflection: string[];
  slug: string;
  tiles: ArtifactTile[];
  title: string;
};

const artifactCases: Record<string, ArtifactCase> = {
  sentinel: {
    slug: "sentinel",
    title: "sentinel / 2025 / native ios risk system",
    body:
      "A 48-hour SwiftUI MVP that turns weather risk into prioritized homeowner actions. The proof is speed: design, native build, demo, and public source in one sprint.",
    meta: [
      { label: "role", value: "design engineer, native ios prototype" },
      { label: "constraint", value: "48-hour hackathon, high-stakes homeowner risk" },
      { label: "decision", value: "priority over dashboards" },
      { label: "outcome", value: "winner, google x scad flux 2025" },
    ],
    tiles: [
      {
        id: "sentinel-demo",
        title: "demo loop",
        label: "native proof",
        type: "video",
        src: "/projects/sentinel/demo.mp4",
        caption: "the shipped SwiftUI MVP, not a static deck.",
        className: "atlas-proof-tile--wide",
      },
      {
        id: "sentinel-risk-state",
        title: "risk state",
        label: "live model",
        type: "live",
        live: "sentinel-risk",
        caption: "risk changes the recommended action, not just the color.",
        className: "atlas-proof-tile--live",
      },
      {
        id: "sentinel-surfaces",
        title: "ios surfaces",
        label: "scan flow",
        type: "sequence",
        images: [
          { src: "/projects/sentinel/main.png", alt: "Sentinel main risk dashboard", label: "main" },
          { src: "/projects/sentinel/weather-alerts.png", alt: "Sentinel weather alert screen", label: "alerts" },
          { src: "/projects/sentinel/recommended-actions.png", alt: "Sentinel recommended actions screen", label: "actions" },
          { src: "/projects/sentinel/historical-timeline.png", alt: "Sentinel historical timeline screen", label: "timeline" },
        ],
        caption: "homeowner risk moves from signal to next action.",
        className: "atlas-proof-tile--patient",
      },
      {
        id: "sentinel-risk-contract",
        title: "risk contract",
        label: "system sketch",
        type: "code",
        code: [
          "type RiskSignal = {",
          "  source: 'storm' | 'wind' | 'rain';",
          "  severity: 1 | 2 | 3;",
          "  area: HomeZone;",
          "};",
          "",
          "const nextAction = prioritize(risk, homeProfile);",
        ].join("\n"),
        caption: "case-study sketch of the action model behind the MVP.",
        className: "atlas-proof-tile--code",
      },
      {
        id: "sentinel-decision-log",
        title: "decision log",
        label: "context",
        type: "log",
        rows: [
          { label: "speed", value: "native prototype in 48 hours" },
          { label: "clarity", value: "one next action over dense analytics" },
          { label: "proof", value: "demo video, public repo, public post" },
        ],
        caption: "why the MVP reads as product, not concept art.",
        className: "atlas-proof-tile--log",
      },
    ],
    reflection: [
      "The strongest proof is the compression: idea, native interface, and working demo inside one sprint.",
      "The next version should make the risk model more inspectable without making the app feel like a dashboard.",
    ],
  },
  "portfolio-ai": {
    slug: "portfolio-ai",
    title: "portfolio ai / 2025 / ai native website system",
    body:
      "A live portfolio system that answers questions, exposes machine-readable proof, and routes visitors to the right work. The AI is a utility layer, not the whole interface.",
    meta: [
      { label: "role", value: "design engineer, solo build" },
      { label: "constraint", value: "portfolio, ai intake, public proof" },
      { label: "decision", value: "ai as command utility, not chatbot decoration" },
      { label: "outcome", value: "live site, public repo, design system routes" },
    ],
    tiles: [
      {
        id: "portfolio-router",
        title: "intent router",
        label: "live command",
        type: "live",
        live: "portfolio-router",
        caption: "one intent moves to the right proof surface.",
        className: "atlas-proof-tile--live",
      },
      {
        id: "portfolio-interface",
        title: "interface surfaces",
        label: "product system",
        type: "sequence",
        images: [
          { src: "/projects/portfolio-ai/chat-interface.png", alt: "Portfolio AI chat interface", label: "chat" },
          { src: "/projects/portfolio-ai/project-cards.png", alt: "Portfolio AI project cards", label: "cards" },
          { src: "/projects/portfolio-ai/architecture.png", alt: "Portfolio AI architecture diagram", label: "system" },
        ],
        caption: "the site explains, qualifies, and opens relevant evidence.",
        className: "atlas-proof-tile--wide",
      },
      {
        id: "portfolio-demo",
        title: "demo loop",
        label: "live site proof",
        type: "video",
        src: "/projects/portfolio-ai/demo.mp4",
        caption: "the portfolio behaves like a small product surface.",
        className: "atlas-proof-tile--assign",
      },
      {
        id: "portfolio-route-contract",
        title: "route contract",
        label: "system sketch",
        type: "code",
        code: [
          "type PortfolioCommand =",
          "  | { intent: 'view.work'; target: ProjectSlug }",
          "  | { intent: 'copy.email' }",
          "  | { intent: 'ask.portfolio'; query: string };",
          "",
          "openProof(command);",
        ].join("\n"),
        caption: "the command layer stays predictable even when the visitor asks in natural language.",
        className: "atlas-proof-tile--code",
      },
      {
        id: "portfolio-system-links",
        title: "system routes",
        label: "public proof",
        type: "links",
        links: [
          { label: "Design system proof", href: "/design-system", meta: "page" },
          { label: "Design system markdown", href: "/design-system.md", meta: "markdown" },
          { label: "Design tokens JSON", href: "/design-system/tokens.json", meta: "json" },
        ],
        caption: "tokens and AI-readable docs make the portfolio inspectable.",
        className: "atlas-proof-tile--motion",
      },
      {
        id: "portfolio-decision-log",
        title: "decision log",
        label: "context",
        type: "log",
        rows: [
          { label: "ai", value: "utility inside the OS, not the homepage" },
          { label: "proof", value: "case studies, markdown, tokens, source" },
          { label: "motion", value: "state confirmation over decoration" },
        ],
        caption: "how the site keeps the AI from feeling like a gimmick.",
        className: "atlas-proof-tile--log",
      },
    ],
    reflection: [
      "The portfolio is strongest when the AI helps the visitor move, not when it performs.",
      "The next version should make project-specific answers more grounded in visible proof tiles.",
    ],
  },
  mindline: {
    slug: "mindline",
    title: "mindline / 2025 / behavioral ai product concept",
    body:
      "A research-led AI product concept for betting addiction. The case study is about reasoning: triggers, emotional state, intervention timing, and why awareness beats blocking.",
    meta: [
      { label: "role", value: "product designer, ux researcher" },
      { label: "constraint", value: "sensitive behavior, relapse timing, trust" },
      { label: "decision", value: "awareness over restriction" },
      { label: "outcome", value: "6 interviews, product concept, ai ux flow" },
    ],
    tiles: [
      {
        id: "mindline-loop",
        title: "intervention loop",
        label: "live reasoning",
        type: "live",
        live: "mindline-loop",
        caption: "emotion becomes a signal before it becomes an action.",
        className: "atlas-proof-tile--live",
      },
      {
        id: "mindline-core-flow",
        title: "core flow",
        label: "product thinking",
        type: "sequence",
        images: [
          { src: "/projects/mindline/log.png", alt: "Mindline emotional logging screen", label: "log" },
          { src: "/projects/mindline/suggestion.png", alt: "Mindline personalized suggestion screen", label: "suggest" },
          { src: "/projects/mindline/emotionalreflection.png", alt: "Mindline emotional reflection screen", label: "reflect" },
          { src: "/projects/mindline/insight.png", alt: "Mindline AI pattern insight screen", label: "insight" },
        ],
        caption: "the product turns emotional context into a small intervention path.",
        className: "atlas-proof-tile--wide",
      },
      {
        id: "mindline-support-surfaces",
        title: "support surfaces",
        label: "prototype set",
        type: "gallery",
        images: [
          { src: "/projects/mindline/ai.png", alt: "Mindline AI support screen", label: "ai support" },
          { src: "/projects/mindline/calendar.png", alt: "Mindline calendar screen", label: "calendar" },
          { src: "/projects/mindline/shorts.png", alt: "Mindline social context screen", label: "context" },
          { src: "/projects/mindline/main.png", alt: "Mindline onboarding screen", label: "onboarding" },
        ],
        caption: "supporting screens stay secondary to the behavioral loop.",
        className: "atlas-proof-tile--patient",
      },
      {
        id: "mindline-reasoning-model",
        title: "reasoning model",
        label: "system sketch",
        type: "code",
        code: [
          "type InterventionSignal = {",
          "  emotion: Emotion;",
          "  context: SocialTrigger[];",
          "  risk: 'low' | 'watch' | 'urgent';",
          "};",
          "",
          "suggest(nextBestAction(signal));",
        ].join("\n"),
        caption: "case-study sketch of the product logic, not a production model.",
        className: "atlas-proof-tile--code",
      },
      {
        id: "mindline-decision-log",
        title: "decision log",
        label: "context",
        type: "log",
        rows: [
          { label: "research", value: "6 interviews around triggers and relapse moments" },
          { label: "product", value: "reflection and support before blocking" },
          { label: "ai", value: "pattern recognition as coaching, not surveillance" },
        ],
        caption: "the project is strongest as reasoning proof.",
        className: "atlas-proof-tile--log",
      },
    ],
    reflection: [
      "Mindline should stay careful: this is product thinking, not a clinical claim.",
      "The next version should make the intervention boundary clearer and show how trust is protected.",
    ],
  },
};

export function hasProjectArtifactCase(slug: string) {
  return slug in artifactCases;
}

function ProjectProofTile({
  artifactType,
  caption,
  children,
  className,
  id,
  label,
  title,
}: {
  artifactType: string;
  caption: string;
  children: ReactNode;
  className: string;
  id: string;
  label: string;
  title: string;
}) {
  return (
    <article id={id} className={`atlas-proof-tile ${className}`} aria-label={`${title} proof tile`}>
      <div className="atlas-proof-tile__body">{children}</div>
      <div className="atlas-proof-tile__copy">
        <div className="atlas-proof-tile__title-row">
          <p className="atlas-proof-tile__title">
            {title}
            <span>{label}</span>
          </p>
          <span className="atlas-proof-tile__type">{artifactType}</span>
        </div>
        <p className="atlas-proof-tile__caption">{caption}</p>
      </div>
    </article>
  );
}

function ProofImageSequence({ images }: { images: ArtifactImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="project-proof-sequence">
      <figure className="project-proof-sequence__main">
        <img src={active.src} alt={active.alt} draggable={false} loading="eager" decoding="async" />
      </figure>
      <div className="project-proof-sequence__tabs" aria-label="proof frames">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className="micro-focus micro-pressable"
            data-active={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          >
            {image.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProofGallery({ images }: { images: ArtifactImage[] }) {
  return (
    <div className="project-proof-gallery">
      {images.map((image) => (
        <figure key={image.src}>
          <img src={image.src} alt={image.alt} draggable={false} loading="eager" decoding="async" />
          <figcaption>{image.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const sentinelRiskStates = [
  { label: "watch", action: "inspect gutters", score: 42, zone: "roof line" },
  { label: "warning", action: "book inspection", score: 68, zone: "basement" },
  { label: "urgent", action: "protect windows", score: 86, zone: "south wall" },
] as const;

function SentinelRiskTile() {
  const [riskIndex, setRiskIndex] = useState(1);
  const risk = sentinelRiskStates[riskIndex] ?? sentinelRiskStates[0];

  return (
    <div className="project-live-model" data-tone={risk.label}>
      <div className="project-live-model__readout">
        <span>{risk.label}</span>
        <output>{risk.score}% risk</output>
      </div>
      <div className="atlas-capacity__meter" aria-hidden="true">
        <span style={{ width: `${risk.score}%` }} />
      </div>
      <div className="atlas-state-rail atlas-state-rail--controls" aria-label="risk states">
        {sentinelRiskStates.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className="atlas-state-dot micro-focus micro-pressable"
            data-active={riskIndex === index ? "true" : undefined}
            aria-label={`set Sentinel risk to ${item.label}`}
            onClick={() => setRiskIndex(index)}
          />
        ))}
      </div>
      <dl className="atlas-live-list">
        <div>
          <dt>zone</dt>
          <dd>{risk.zone}</dd>
        </div>
        <div>
          <dt>next</dt>
          <dd>{risk.action}</dd>
        </div>
      </dl>
    </div>
  );
}

const portfolioRouteStates = [
  { label: "ask", query: "show ai work", route: "/work/portfolio-ai", proof: "system case" },
  { label: "qualify", query: "need a prototype", route: "/work/atlas", proof: "artifact grid" },
  { label: "copy", query: "contact minwook", route: "copy email", proof: "utility" },
] as const;

function PortfolioRouterTile() {
  const [routeIndex, setRouteIndex] = useState(0);
  const route = portfolioRouteStates[routeIndex] ?? portfolioRouteStates[0];

  return (
    <div className="project-command-demo">
      <div className="project-command-demo__input">search index commands</div>
      <button
        type="button"
        className="project-command-demo__row micro-focus micro-pressable"
        aria-label="advance portfolio command route"
        onClick={() => setRouteIndex((index) => (index + 1) % portfolioRouteStates.length)}
      >
        <span>{route.query}</span>
        <strong>{route.route}</strong>
      </button>
      <p>{route.proof}</p>
    </div>
  );
}

const mindlineLoopStates = [
  { label: "emotion", value: "anxious", next: "name the urge" },
  { label: "trigger", value: "social pressure", next: "pause timer" },
  { label: "support", value: "reflection", next: "message ally" },
] as const;

function MindlineLoopTile() {
  const [loopIndex, setLoopIndex] = useState(0);
  const loop = mindlineLoopStates[loopIndex] ?? mindlineLoopStates[0];

  return (
    <div className="project-live-model">
      <button
        type="button"
        className="project-loop-card micro-focus micro-pressable"
        aria-label="advance Mindline intervention loop"
        onClick={() => setLoopIndex((index) => (index + 1) % mindlineLoopStates.length)}
      >
        <span>{loop.label}</span>
        <strong>{loop.value}</strong>
        <em>{loop.next}</em>
      </button>
      <div className="atlas-state-rail atlas-state-rail--controls" aria-label="intervention states">
        {mindlineLoopStates.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className="atlas-state-dot micro-focus micro-pressable"
            data-active={loopIndex === index ? "true" : undefined}
            aria-label={`set Mindline loop to ${item.label}`}
            onClick={() => setLoopIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

function LiveTile({ type }: { type: ArtifactTile & { type: "live" } }) {
  if (type.live === "sentinel-risk") return <SentinelRiskTile />;
  if (type.live === "portfolio-router") return <PortfolioRouterTile />;
  return <MindlineLoopTile />;
}

function CodeTile({ code }: { code: string }) {
  return (
    <div className="atlas-code-artifact">
      <pre className="detail-artifact-code">
        <code>
          {code.split("\n").map((line, lineIndex) => (
            <span key={`${lineIndex}-${line}`} className="detail-artifact-code-line">
              {line || "\u00a0"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function LinksTile({ links }: { links: { href: string; label: string; meta: string }[] }) {
  return (
    <div className="project-proof-links">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          aria-label={link.label}
          className="studio-detail-link-row micro-focus micro-pressable"
        >
          <span>{link.label}</span>
          <span className="studio-detail-link-meta" aria-hidden="true">/ {link.meta}</span>
        </a>
      ))}
    </div>
  );
}

function LogTile({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="atlas-live-list atlas-live-list--log">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TileBody({ tile, projectTitle, reduceMotion }: { tile: ArtifactTile; projectTitle: string; reduceMotion: boolean }) {
  if (tile.type === "sequence") return <ProofImageSequence images={tile.images} />;
  if (tile.type === "gallery") return <ProofGallery images={tile.images} />;
  if (tile.type === "live") return <LiveTile type={tile} />;
  if (tile.type === "code") return <CodeTile code={tile.code} />;
  if (tile.type === "links") return <LinksTile links={tile.links} />;
  if (tile.type === "log") return <LogTile rows={tile.rows} />;

  return (
    <StudioVideoPlayer
      autoPlay={!reduceMotion}
      loop
      muted
      src={tile.src}
      label={`${projectTitle} demo`}
      preload="metadata"
      poster={makeVideoPosterDataUrl(tile.title)}
      className="project-proof-video"
      videoClassName="block w-full bg-[var(--bg-element)]"
    />
  );
}

export default function ProjectArtifactCaseStudy({ project }: { project: PortfolioProject }) {
  const reduceMotion = Boolean(useReducedMotion());
  const artifactCase = useMemo(() => artifactCases[project.slug], [project.slug]);

  if (!artifactCase) return null;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className="atlas-case detail-outline-stack"
      aria-labelledby={`${artifactCase.slug}-proof-title`}
    >
      <section className="atlas-case__intro">
        <h1 id={`${artifactCase.slug}-proof-title`}>{artifactCase.title}</h1>
        <p>{artifactCase.body}</p>
      </section>

      <section className="atlas-meta-surface" aria-labelledby={`${artifactCase.slug}-meta-title`}>
        <div className="atlas-meta-surface__header">
          <span id={`${artifactCase.slug}-meta-title`}>profile</span>
          <span>role / constraint / decision / outcome</span>
        </div>
        <dl className="atlas-meta-block" aria-label="role, constraint, decision, and outcome">
          {artifactCase.meta.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id={`${artifactCase.slug}-proof-bento`} className="atlas-proof-section">
        <DetailOutlineHeading heading="proof bento grid" eyebrow={project.builder.status.label} />
        <div className="atlas-proof-grid">
          {artifactCase.tiles.map((tile) => (
            <ProjectProofTile
              key={tile.id}
              artifactType={tile.type === "sequence" ? "sequence" : tile.type === "gallery" ? "scan" : tile.type}
              caption={tile.caption}
              className={tile.className}
              id={tile.id}
              label={tile.label}
              title={tile.title}
            >
              <TileBody tile={tile} projectTitle={project.title} reduceMotion={reduceMotion} />
            </ProjectProofTile>
          ))}
        </div>
      </section>

      <section id={`${artifactCase.slug}-reflection`} className="detail-outline-section">
        <DetailOutlineHeading heading="short reflection" />
        <div className="detail-outline-list">
          {artifactCase.reflection.map((line) => (
            <DetailOutlineRow key={line} body={line} />
          ))}
        </div>
      </section>
    </motion.article>
  );
}
