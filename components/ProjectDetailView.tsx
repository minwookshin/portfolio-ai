"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import AtlasProofCaseStudy from "@/components/AtlasProofCaseStudy";
import CaretInteractiveArtifact from "@/components/CaretInteractiveArtifact";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";
import { DetailOutlineHeading, DetailOutlineRow } from "@/components/Outline";
import ProjectCaseStudyEntry from "@/components/ProjectCaseStudyEntry";
import {
  MindlineInteractiveArtifact,
  PortfolioAiInteractiveArtifact,
} from "@/components/ProjectInteractiveArtifacts";
import SentinelInteractiveArtifact from "@/components/SentinelInteractiveArtifact";
import { Project } from "./ProjectCard";
import StudioVideoPlayer from "./StudioVideoPlayer";
import { CaseStudy } from "./detail/CaseStudy";
import type { DetailSection } from "./detail/CaseStudy";
import { getCaseStudy } from "@/data/caseStudies";
import { isVisibleBuilderValue } from "@/data/projects";
import type { BuilderProof, PortfolioProject } from "@/data/projects";

interface ProjectDetailViewProps {
  project: Project | PortfolioProject;
  onBack?: () => void;
  hideBack?: boolean;
  focusQuery?: string | null;
  onAsk?: (q: string) => void;
}

const FOCUS_STOPWORDS = new Set([
  "what", "how", "why", "tell", "about", "your", "this", "that", "the", "and", "for",
  "with", "did", "does", "was", "were", "you", "project", "can", "show", "of", "to",
  "is", "it", "are", "have", "more", "give", "into", "from", "they", "their", "the",
]);

const SEPARATED_CASE_STUDY_SLUGS = ["atlas", "sentinel", "portfolio-ai", "mindline"] as const;

function hasBuilderProof(project: Project | PortfolioProject): project is PortfolioProject {
  return "builder" in project;
}

function hasSeparatedCaseStudy(project: Project | PortfolioProject): project is PortfolioProject {
  return hasBuilderProof(project) && SEPARATED_CASE_STUDY_SLUGS.includes(project.slug as typeof SEPARATED_CASE_STUDY_SLUGS[number]);
}

type HeroSection = Extract<DetailSection, { kind: "hero" }>;

function isHeroSection(section: DetailSection | undefined): section is HeroSection {
  return section?.kind === "hero";
}

function joinVisible(items: Array<string | undefined | null>) {
  return items.filter(isVisibleBuilderValue).join(", ");
}

function getPublicProof(project: Project | PortfolioProject, proof?: BuilderProof) {
  const proofTypes = [
    "github" in project && project.github ? "source" : null,
    "link" in project && project.link ? "live site" : null,
    proof?.demo?.video ? "demo" : null,
    proof?.demo?.href ? "demo" : null,
    "linkedin" in project && project.linkedin ? "post" : null,
  ].filter(isVisibleBuilderValue);

  if (proofTypes.length > 0) return proofTypes.join(" · ");
  return proof?.status.label;
}

function ProjectHeroMedia({
  hero,
  project,
  proof,
  reduceMotion,
}: {
  hero: HeroSection | null;
  project: Project | PortfolioProject;
  proof?: BuilderProof;
  reduceMotion: boolean;
}) {
  if (hero?.hideMedia) return null;

  const video = proof?.demo?.video;
  const image = hero?.image ?? project.image ?? project.icon;
  const imageStyle = hero?.imageStyle;
  const isCaret = "slug" in project && project.slug === "caret";

  if (video) {
    return (
      <StudioVideoPlayer
        autoPlay={!reduceMotion}
        loop
        muted
        src={video}
        label={`${project.title} demo`}
        preload="metadata"
        poster={makeVideoPosterDataUrl(proof.demo?.label ?? project.title)}
        className={`studio-detail-hero-media ${isCaret ? "studio-video-player--caret" : ""}`}
        videoClassName={`block w-full bg-[var(--bg-element)] ${isCaret ? "studio-video-player__video--caret" : ""}`}
      />
    );
  }

  if (!image) return null;

  if (imageStyle === "phone") {
    return (
      <div className="studio-detail-hero-media flex justify-center bg-[var(--bg-base)] py-[var(--space-3)]">
        <img src={image} alt={project.title} className="h-auto w-full max-w-[280px]" draggable={false} loading="eager" decoding="async" />
      </div>
    );
  }

  return (
    <div className="studio-detail-hero-media">
      <img src={image} alt={project.title} className="h-auto w-full object-cover" draggable={false} loading="eager" decoding="async" />
    </div>
  );
}

function ProjectDetailHero({
  hero,
  project,
  proof,
  reduceMotion,
  hideMedia = false,
}: {
  hero: HeroSection | null;
  project: Project | PortfolioProject;
  proof?: BuilderProof;
  reduceMotion: boolean;
  hideMedia?: boolean;
}) {
  const stack = joinVisible(proof?.stack.slice(0, 4) ?? project.tags.slice(0, 4));
  const outcome = proof?.results.find((item) => isVisibleBuilderValue(item.value))?.value ?? proof?.status.label;
  const title = hero?.title ?? project.title;
  const subtitle = hero?.subtitle ?? project.overview ?? proof?.oneLiner ?? project.fullDescription;
  const eyebrow = project.studioLabel ?? hero?.badge;
  const hasHeroMedia = !hideMedia && !hero?.hideMedia && Boolean(proof?.demo?.video || hero?.image || project.image || project.icon);
  const recruiterSignals = [
    { label: "role", value: proof?.role ?? project.role },
    { label: "time", value: project.timeline ?? project.date },
    { label: "stack", value: stack },
    { label: "public", value: getPublicProof(project, proof) },
    { label: "result", value: outcome },
  ].filter((item) => isVisibleBuilderValue(item.value));

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      className="studio-detail-hero"
    >
      {eyebrow && (
        <p className="mb-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-[var(--measure)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
          {subtitle}
        </p>
      )}
      {recruiterSignals.length > 0 && (
        <dl className="studio-detail-proof-strip" aria-label="project summary">
          {recruiterSignals.map((signal) => (
            <div key={signal.label}>
              <dt>{signal.label}</dt>
              <dd>
                {signal.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {hasHeroMedia && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? tweens.none : { ...tweens.fast, delay: 0.04 }}
          className="mt-[var(--space-4)]"
        >
          <ProjectHeroMedia hero={hero} project={project} proof={proof} reduceMotion={reduceMotion} />
        </motion.div>
      )}
    </motion.section>
  );
}

function BuilderProofSummary({ proof }: { proof: BuilderProof }) {
  const demoNote = isVisibleBuilderValue(proof.demo?.note) ? proof.demo?.note : undefined;
  const demoHref = proof.demo?.href;

  return (
    <section className="studio-detail-proof detail-outline-stack">
      <DetailNote eyebrow="decision" body={proof.oneLiner} />
      {isVisibleBuilderValue(proof.pipeline) && <DetailNote eyebrow="path" body={proof.pipeline} />}

      {proof.demo && demoHref && (
        <section>
          <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">demo</p>
          <div className="mt-[var(--space-1)] flex flex-wrap items-center gap-x-[var(--space-2)] gap-y-[var(--space-1)]">
            <a
              href={demoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-lateral-link studio-proof-link micro-focus micro-pressable inline-flex items-center text-[length:var(--type-0)]"
            >
              {proof.demo.label}
            </a>
            {isVisibleBuilderValue(demoNote) && (
              <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[var(--leading-body)] text-[var(--text-muted)]">
                {demoNote}
              </p>
            )}
          </div>
        </section>
      )}

      <MetricGrid title="scope" items={proof.scope} />
      <MetricGrid title="outcome" items={proof.results} />
    </section>
  );
}

function DetailNote({ eyebrow, body }: { eyebrow: string; body: ReactNode }) {
  return (
    <section className="detail-outline-section detail-outline-section--compact">
      <DetailOutlineRow body={body} bodyClassName="detail-outline-row-body--primary" signal="none" title={eyebrow} />
    </section>
  );
}

function MetricGrid({ title, items }: { title: string; items: BuilderProof["scope"] }) {
  const visibleItems = items.filter((item) => isVisibleBuilderValue(item.value));

  if (visibleItems.length === 0) return null;

  return (
    <section className="detail-outline-section detail-outline-section--compact">
      <DetailOutlineHeading heading={title} signal="none" />
      <div className="detail-outline-list detail-outline-list--grid">
        {visibleItems.map((item) => (
          <DetailOutlineRow
            key={`${title}-${item.label}`}
            body={isVisibleBuilderValue(item.note) ? item.note : undefined}
            meta={item.label}
            signal="none"
            title={item.value}
          />
        ))}
      </div>
    </section>
  );
}

export default function ProjectDetailView({ project, onBack, hideBack = false, focusQuery, onAsk }: ProjectDetailViewProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // Deep-link: scroll to and highlight the section that answers the user's question
  useEffect(() => {
    if (!focusQuery || !rootRef.current) return;
    const titleWords = new Set(project.title.toLowerCase().match(/[a-z]+/g) ?? []);
    const words = (focusQuery.toLowerCase().match(/[a-z]+/g) ?? []).filter(
      (w) => w.length >= 4 && !FOCUS_STOPWORDS.has(w) && !titleWords.has(w)
    );
    if (!words.length) return;
    const timer = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      const headings = Array.from(root.querySelectorAll<HTMLElement>("h1, h2, h3, h4"));
      const paras = Array.from(root.querySelectorAll<HTMLElement>("p"));
      const matches = (el: HTMLElement) => {
        const txt = (el.textContent ?? "").toLowerCase();
        return words.some((w) => txt.includes(w));
      };
      const target = headings.find(matches) ?? paras.find(matches);
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        target.classList.add("section-flash");
        setTimeout(() => target.classList.remove("section-flash"), motionDurations.flash * 1000);
      }
    }, 480);
    return () => clearTimeout(timer);
  }, [focusQuery, project.title, reduceMotion]);

  // Every project renders through the case-study system — authored studies for
  // the deep ones, auto-synthesized snapshots for the rest.
  const caseStudy = getCaseStudy(project);
  const hero = isHeroSection(caseStudy.sections[0]) ? caseStudy.sections[0] : null;
  const bodyCaseStudy = hero ? { ...caseStudy, sections: caseStudy.sections.slice(1) } : caseStudy;
  const proof = hasBuilderProof(project) ? project.builder : undefined;
  const isAtlas = hasBuilderProof(project) && project.slug === "atlas";
  const isSentinel = hasBuilderProof(project) && project.slug === "sentinel";
  const isPortfolioAi = hasBuilderProof(project) && project.slug === "portfolio-ai";
  const isMindline = hasBuilderProof(project) && project.slug === "mindline";
  const isCaretArtifact = hasBuilderProof(project) && project.slug === "caret";
  const artifactBoardReplacesHeroMedia = isSentinel || isPortfolioAi || isMindline || isCaretArtifact;
  const separatesCaseStudy = hasSeparatedCaseStudy(project);
  const hasAuthoredCaseStudy = Boolean(caseStudy.authored);

  return (
    <motion.div
      ref={rootRef}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      className="studio-detail-body mb-[var(--space-6)]"
    >
      {!hideBack && onBack && (
        <motion.button
          onClick={onBack}
          whileHover={reduceMotion ? undefined : { x: -4 }}
          transition={reduceMotion ? tweens.none : springs.spatialFast}
          className="intro-contact-link micro-focus micro-pressable mb-[var(--space-4)] flex w-fit items-center gap-[var(--space-1)] text-[length:var(--type-0)]"
        >
          <MaterialArrowForwardIcon className="site-back-icon" />
          <span>Back to projects</span>
        </motion.button>
      )}
      {isAtlas ? (
        <AtlasProofCaseStudy project={project} />
      ) : (
        <>
          <ProjectDetailHero
            hero={hero}
            project={project}
            proof={proof}
            reduceMotion={Boolean(reduceMotion)}
            hideMedia={artifactBoardReplacesHeroMedia}
          />
          {proof && !hasAuthoredCaseStudy && <BuilderProofSummary proof={proof} />}
          {isSentinel && <SentinelInteractiveArtifact />}
          {isCaretArtifact && <CaretInteractiveArtifact />}
          {(isSentinel || isCaretArtifact) && proof?.demo?.video && (
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? tweens.none : { ...tweens.fast, delay: 0.04 }}
              className="studio-detail-secondary-media"
            >
              <ProjectHeroMedia hero={hero} project={project} proof={proof} reduceMotion={Boolean(reduceMotion)} />
            </motion.section>
          )}
          {isPortfolioAi && <PortfolioAiInteractiveArtifact />}
          {isMindline && <MindlineInteractiveArtifact />}
          {separatesCaseStudy ? (
            <ProjectCaseStudyEntry>
              <CaseStudy data={bodyCaseStudy} onAsk={onAsk} />
            </ProjectCaseStudyEntry>
          ) : (
            <CaseStudy data={bodyCaseStudy} onAsk={onAsk} />
          )}
        </>
      )}
    </motion.div>
  );
}
