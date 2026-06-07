"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { PointerEvent } from "react";
import type { LabStudy, PortfolioProject } from "@/data/projects";
import { motionDurations, motionEasings, tweens } from "@/lib/material/motion";

type DemoProps = {
  reduceMotion: boolean;
};

const detailLabels: Record<LabStudy["kind"], string> = {
  "motion-taste": "motion system",
  "hover-row": "interaction study",
  "route-transition": "route study",
  "cursor-study": "cursor study",
  "motion-curve": "tiny tool",
};

function StudyButton({
  active = false,
  children,
  onClick,
}: {
  active?: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-active={active}
      onClick={onClick}
      className="lab-study-control micro-focus micro-pressable"
    >
      {children}
    </button>
  );
}

function MotionTasteDemo({ reduceMotion }: DemoProps) {
  const [mode, setMode] = useState<"preview" | "panel" | "press">("preview");
  const copy = {
    preview: ["preview enters", "opacity, blur, scale"],
    panel: ["content changes", "small y movement"],
    press: ["button responds", "scale stays subtle"],
  }[mode];

  return (
    <div className="lab-study-demo">
      <div className="lab-study-controls" aria-label="motion mode">
        <StudyButton active={mode === "preview"} onClick={() => setMode("preview")}>preview</StudyButton>
        <StudyButton active={mode === "panel"} onClick={() => setMode("panel")}>panel</StudyButton>
        <StudyButton active={mode === "press"} onClick={() => setMode("press")}>press</StudyButton>
      </div>
      <div className="lab-study-stage lab-study-stage--motion">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: mode === "press" ? 0.98 : 1, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4, scale: 0.985, filter: "blur(4px)" }}
            transition={reduceMotion ? tweens.none : { ...tweens.base, duration: mode === "press" ? motionDurations.fast : 0.22 }}
            className="lab-motion-card"
          >
            <span className="lab-motion-card__media" />
            <span className="lab-motion-card__copy">
              <span>{copy[0]}</span>
              <span>{copy[1]}</span>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function HoverRowDemo({ reduceMotion }: DemoProps) {
  const rows = [
    ["atlas", "capstone in progress"],
    ["sentinel", "48-hour native ios mvp"],
    ["portfolio ai", "ai intake website"],
  ] as const;
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="lab-study-stage lab-study-stage--split">
      <div className="lab-hover-list">
        {rows.map(([title, meta], index) => (
          <button
            key={title}
            type="button"
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            className="lab-hover-row micro-focus"
          >
            <motion.span
              animate={reduceMotion ? undefined : { x: activeIndex === index ? 6 : 0 }}
              transition={reduceMotion ? tweens.none : tweens.fast}
              className="lab-hover-row__copy"
            >
              <span>{title}</span>
              <span>{meta}</span>
            </motion.span>
          </button>
        ))}
      </div>
      <div className="lab-hover-preview" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98, filter: "blur(7px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99, filter: "blur(4px)" }}
            transition={reduceMotion ? tweens.none : { ...tweens.fast, duration: 0.16 }}
            className="lab-hover-preview__frame"
          >
            <span className="lab-hover-preview__mark">{rows[activeIndex][0].slice(0, 2)}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function RouteTransitionDemo({ reduceMotion }: DemoProps) {
  const tabs = ["work", "writing", "lab"] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("work");
  const content = {
    work: ["selected work", "atlas, sentinel, portfolio ai"],
    writing: ["notes", "code, design, motion"],
    lab: ["studies", "motion, cursor, tiny tools"],
  }[activeTab];

  return (
    <div className="lab-study-demo">
      <div className="lab-route-shell">
        <div className="lab-route-intro">
          <span>minwook shin</span>
          <span>design engineer</span>
        </div>
        <div className="lab-study-controls" aria-label="route tab">
          {tabs.map((tab) => (
            <StudyButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </StudyButton>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={reduceMotion ? tweens.none : { ...tweens.base, duration: 0.24 }}
            className="lab-route-panel"
          >
            <span>{content[0]}</span>
            <span>{content[1]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function CursorGlyph() {
  return (
    <svg viewBox="0 0 13 15" aria-hidden="true" className="lab-cursor-glyph">
      <path d="M1.35 1.15 11.6 7.08 7.2 8.4 5.48 13.36 1.35 1.15Z" />
    </svg>
  );
}

function CursorStudyDemo({ reduceMotion }: DemoProps) {
  const [pointer, setPointer] = useState({ x: 118, y: 72, visible: false });

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: true,
    });
  };

  return (
    <div
      className="lab-study-stage lab-cursor-stage"
      onPointerMove={updatePointer}
      onPointerLeave={() => setPointer((current) => ({ ...current, visible: false }))}
    >
      <div className="lab-cursor-targets">
        <span>default surface</span>
        <span>interactive text</span>
        <span>precision zone</span>
      </div>
      <motion.div
        animate={{
          x: pointer.x,
          y: pointer.y,
          opacity: pointer.visible ? 1 : 0.42,
          scale: pointer.visible ? 1 : 0.96,
        }}
        transition={reduceMotion ? tweens.none : { type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
        className="lab-cursor-proxy"
      >
        <CursorGlyph />
      </motion.div>
    </div>
  );
}

function MotionCurveTesterDemo({ reduceMotion }: DemoProps) {
  const [duration, setDuration] = useState(220);
  const [distance, setDistance] = useState(18);
  const [easing, setEasing] = useState<"standard" | "in-out">("standard");
  const [runKey, setRunKey] = useState(0);
  const ease = easing === "standard" ? motionEasings.standard : motionEasings.inOut;

  return (
    <div className="lab-study-stage lab-curve-tool">
      <div className="lab-curve-track">
        <motion.span
          key={runKey}
          initial={reduceMotion ? false : { x: 0 }}
          animate={{ x: distance }}
          transition={reduceMotion ? tweens.none : { type: "tween", duration: duration / 1000, ease }}
          className="lab-curve-object"
        />
      </div>
      <div className="lab-curve-controls">
        <label>
          <span>duration {duration}ms</span>
          <input
            type="range"
            min="120"
            max="320"
            step="20"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          />
        </label>
        <label>
          <span>distance {distance}px</span>
          <input
            type="range"
            min="4"
            max="32"
            step="2"
            value={distance}
            onChange={(event) => setDistance(Number(event.target.value))}
          />
        </label>
        <div className="lab-study-controls" aria-label="easing">
          <StudyButton active={easing === "standard"} onClick={() => setEasing("standard")}>standard</StudyButton>
          <StudyButton active={easing === "in-out"} onClick={() => setEasing("in-out")}>in-out</StudyButton>
          <StudyButton onClick={() => setRunKey((key) => key + 1)}>replay</StudyButton>
        </div>
      </div>
    </div>
  );
}

function LabStudyDemo({ kind, reduceMotion }: { kind: LabStudy["kind"]; reduceMotion: boolean }) {
  if (kind === "motion-taste") return <MotionTasteDemo reduceMotion={reduceMotion} />;
  if (kind === "hover-row") return <HoverRowDemo reduceMotion={reduceMotion} />;
  if (kind === "route-transition") return <RouteTransitionDemo reduceMotion={reduceMotion} />;
  if (kind === "cursor-study") return <CursorStudyDemo reduceMotion={reduceMotion} />;
  return <MotionCurveTesterDemo reduceMotion={reduceMotion} />;
}

export function LabStudyTileVisual({ kind }: { kind: LabStudy["kind"] }) {
  if (kind === "hover-row") {
    return (
      <span className="lab-study-tile-visual lab-study-tile-visual--rows">
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (kind === "route-transition") {
    return (
      <span className="lab-study-tile-visual lab-study-tile-visual--route">
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (kind === "cursor-study") {
    return (
      <span className="lab-study-tile-visual lab-study-tile-visual--cursor">
        <CursorGlyph />
      </span>
    );
  }

  if (kind === "motion-curve") {
    return (
      <span className="lab-study-tile-visual lab-study-tile-visual--curve">
        <span />
        <span />
      </span>
    );
  }

  return (
    <span className="lab-study-tile-visual lab-study-tile-visual--motion">
      <span />
      <span />
    </span>
  );
}

export default function LabStudyDetailView({ project }: { project: PortfolioProject & { labStudy: LabStudy } }) {
  const reduceMotion = Boolean(useReducedMotion());
  const study = project.labStudy;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className="lab-study-detail"
    >
      <header className="border-t border-[var(--border-light)] pt-[var(--space-3)]">
        <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">
          {detailLabels[study.kind]}
        </p>
        <h1 className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
          {project.title}
        </h1>
        <p className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
          {study.thesis}
        </p>
      </header>

      <LabStudyDemo kind={study.kind} reduceMotion={reduceMotion} />

      <section className="grid gap-[var(--space-3)] border-t border-[var(--border-light)] pt-[var(--space-3)] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <h2 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
            why it works
          </h2>
          <ul className="mt-[var(--space-2)] space-y-[var(--space-2)]">
            {study.points.map((point) => (
              <li key={point} className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
            rules
          </h2>
          <dl className="mt-[var(--space-2)] grid gap-[var(--space-2)]">
            {study.rules.map((rule) => (
              <div key={rule.label} className="border-t border-[var(--border-light)] pt-[var(--space-2)]">
                <dt className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{rule.label}</dt>
                <dd className="mt-[var(--space-1)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">{rule.value}</dd>
                {rule.note && (
                  <dd className="mt-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[var(--leading-body)] text-[var(--text-muted)]">{rule.note}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-[var(--border-light)] pt-[var(--space-3)]">
        <h2 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
          code
        </h2>
        <pre className="lab-study-code mt-[var(--space-2)]"><code>{study.code}</code></pre>
      </section>
    </motion.article>
  );
}
