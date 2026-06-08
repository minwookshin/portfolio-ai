"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { PointerEvent } from "react";
import type { LabStudy, PortfolioProject } from "@/data/projects";
import { motionEasings, tweens } from "@/lib/material/motion";

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
      aria-pressed={active}
      onClick={onClick}
      className="lab-study-control micro-focus micro-pressable"
    >
      {children}
    </button>
  );
}

function MotionTasteDemo() {
  const [active, setActive] = useState(false);

  return (
    <div className="lab-study-stage lab-study-stage--motion">
      <button
        type="button"
        aria-label="motion taste hover sample"
        data-active={active}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        data-project-row="studies"
        className="lab-motion-row micro-focus"
      >
        <span className="project-row-copy lab-motion-row__copy flex max-w-full flex-col items-start gap-2">
          <span className="project-row-title-line--lateral max-w-full font-normal leading-[var(--leading-tight)]">hover row</span>
          <span className="project-row-meta text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">
            {active ? "copy shifts, preview wakes" : "resting state stays quiet"}
          </span>
        </span>
        <span className="lab-motion-row__preview" aria-hidden="true">
          <span className="lab-motion-row__mark">{active ? "on" : "off"}</span>
          <span />
          <span />
        </span>
      </button>
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
            data-active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onPointerEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
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
        <AnimatePresence initial={false}>
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
  const tabs = ["work", "studies"] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("work");
  const content = {
    work: ["selected work", "atlas, sentinel, portfolio ai"],
    studies: ["thinking in motion", "notes, demos, tiny tools"],
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
        <AnimatePresence initial={false}>
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
  const [activeTarget, setActiveTarget] = useState<number | null>(null);
  const targets = ["default surface", "interactive text", "precision zone"];

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
      onPointerDown={updatePointer}
      onPointerLeave={() => {
        setPointer((current) => ({ ...current, visible: false }));
        setActiveTarget(null);
      }}
    >
      <div className="lab-cursor-targets">
        {targets.map((target, index) => (
          <button
            key={target}
            type="button"
            data-active={activeTarget === index}
            onPointerEnter={() => setActiveTarget(index)}
            onFocus={() => setActiveTarget(index)}
            onClick={() => setActiveTarget(index)}
            className="lab-cursor-target micro-focus"
          >
            {target}
          </button>
        ))}
      </div>
      <motion.div
        animate={{
          x: pointer.x,
          y: pointer.y,
          opacity: pointer.visible ? 1 : 0.42,
          scale: pointer.visible ? (activeTarget === null ? 1 : 1.06) : 0.96,
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
  if (kind === "motion-taste") return <MotionTasteDemo />;
  if (kind === "hover-row") return <HoverRowDemo reduceMotion={reduceMotion} />;
  if (kind === "route-transition") return <RouteTransitionDemo reduceMotion={reduceMotion} />;
  if (kind === "cursor-study") return <CursorStudyDemo reduceMotion={reduceMotion} />;
  return <MotionCurveTesterDemo reduceMotion={reduceMotion} />;
}

function LabStudyGlyph({ kind }: { kind: LabStudy["kind"] }) {
  if (kind === "hover-row") {
    return (
      <span className="lab-study-glyph lab-study-glyph--rows">
        <span />
        <span />
        <span />
        <span className="lab-study-glyph__row-indicator" />
      </span>
    );
  }

  if (kind === "route-transition") {
    return (
      <span className="lab-study-glyph lab-study-glyph--route">
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (kind === "cursor-study") {
    return (
      <span className="lab-study-glyph lab-study-glyph--cursor">
        <span className="lab-study-glyph__cursor-target" />
        <CursorGlyph />
      </span>
    );
  }

  if (kind === "motion-curve") {
    return (
      <span className="lab-study-glyph lab-study-glyph--curve">
        <svg viewBox="0 0 120 84" aria-hidden="true">
          <path className="lab-study-glyph__curve-guide" d="M16 58 C38 16 72 70 104 26" />
          <path className="lab-study-glyph__curve-line" d="M16 58 C38 16 72 70 104 26" />
          <circle cx="16" cy="58" r="2.5" />
          <circle cx="104" cy="26" r="2.5" />
          <circle className="lab-study-glyph__curve-dot" cx="16" cy="58" r="4" />
        </svg>
      </span>
    );
  }

  return (
    <span className="lab-study-glyph lab-study-glyph--motion">
      <span className="lab-study-glyph__motion-frame" />
      <span className="lab-study-glyph__motion-card" />
      <span className="lab-study-glyph__motion-dot" />
    </span>
  );
}

export function LabStudyTileVisual({
  animated = true,
  className = "",
  kind,
}: {
  animated?: boolean;
  className?: string;
  kind: LabStudy["kind"];
}) {
  const classes = [
    "lab-study-tile-visual",
    `lab-study-tile-visual--${kind}`,
    animated ? "lab-study-tile-visual--animated" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={classes}>
      <LabStudyGlyph kind={kind} />
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
