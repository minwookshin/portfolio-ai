"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { ArrowLeft as ArrowBackIcon } from "lucide-react";
import { Project } from "./ProjectCard";
import { CaseStudy } from "./detail/CaseStudy";
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

function hasBuilderProof(project: Project | PortfolioProject): project is PortfolioProject {
  return "builder" in project;
}

function BuilderProofIntro({ proof }: { proof: BuilderProof }) {
  const stack = proof.stack.filter(isVisibleBuilderValue).join(", ");
  const demoNote = isVisibleBuilderValue(proof.demo?.note) ? proof.demo?.note : proof.demo?.label;
  const hasDemo = Boolean(proof.demo?.video || proof.demo?.href);

  return (
    <section className="mb-[var(--space-6)] space-y-[var(--space-4)]">
      <div className="grid gap-x-[var(--space-3)] gap-y-[var(--space-2)] border-y border-[var(--border-light)] py-[var(--space-3)] sm:grid-cols-2">
        <SummaryItem label="role" value={proof.role} />
        {stack && <SummaryItem label="stack" value={stack} />}
        <SummaryItem
          label="status"
          value={
            proof.status.href ? (
              <a
                href={proof.status.href}
                target="_blank"
                rel="noopener noreferrer"
                className="intro-contact-link micro-focus micro-pressable text-[length:var(--type-0)]"
              >
                {proof.status.label}
              </a>
            ) : (
              proof.status.label
            )
          }
        />
        <SummaryItem label="what it does" value={proof.oneLiner} />
      </div>

      {proof.demo && hasDemo && (
        <div className="space-y-[var(--space-2)]">
          {proof.demo.video ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={makeVideoPosterDataUrl(proof.demo.label)}
              className="block w-full bg-[var(--bg-element)]"
            >
              <source src={proof.demo.video} type="video/mp4" />
            </video>
          ) : proof.demo.href ? (
            <a
              href={proof.demo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="intro-contact-link micro-focus micro-pressable inline-flex items-center text-[length:var(--type-0)]"
            >
              {proof.demo.label}
            </a>
          ) : null}
          {isVisibleBuilderValue(demoNote) && (
            <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[var(--leading-body)] text-[var(--text-muted)]">
              {demoNote}
            </p>
          )}
        </div>
      )}

      {isVisibleBuilderValue(proof.pipeline) && (
        <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">
          {proof.pipeline}
        </p>
      )}

      <MetricGrid title="engineering scope" items={proof.scope} />
      <MetricGrid title="results" items={proof.results} />
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{label}</p>
      <p className="mt-[var(--space-1)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function MetricGrid({ title, items }: { title: string; items: BuilderProof["scope"] }) {
  const visibleItems = items.filter((item) => isVisibleBuilderValue(item.value));

  if (visibleItems.length === 0) return null;

  return (
    <section className="space-y-[var(--space-2)]">
      <h2 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{title}</h2>
      <div className="grid gap-[var(--space-2)] sm:grid-cols-2">
        {visibleItems.map((item) => (
          <div key={`${title}-${item.label}`} className="border border-[var(--border-light)] bg-[var(--bg-surface)] px-[var(--space-2)] py-[var(--space-2)]">
            <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{item.label}</p>
            <p className="mt-[var(--space-1)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">{item.value}</p>
            {isVisibleBuilderValue(item.note) && <p className="mt-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[var(--leading-body)] text-[var(--text-muted)]">{item.note}</p>}
          </div>
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

  return (
    <motion.div
      ref={rootRef}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      className="mb-[var(--space-6)]"
    >
      {!hideBack && onBack && (
        <motion.button
          onClick={onBack}
          whileHover={reduceMotion ? undefined : { x: -4 }}
          transition={reduceMotion ? tweens.none : springs.spatialFast}
          className="intro-contact-link micro-focus micro-pressable mb-[var(--space-4)] flex w-fit items-center gap-[var(--space-1)] text-[length:var(--type-0)]"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>Back to projects</span>
        </motion.button>
      )}
      {hasBuilderProof(project) && <BuilderProofIntro proof={project.builder} />}
      <CaseStudy data={caseStudy} onAsk={onAsk} />
    </motion.div>
  );
}
