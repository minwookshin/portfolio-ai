"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
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
  "ai-loop": "ai interface study",
};

const cursorGlyphPath =
  "M1.18 0.95C0.7 0.68 0.14 1.1 0.28 1.66L3.1 13.42C3.29 14.22 4.35 14.38 4.77 13.68L6.28 11.04C6.54 10.59 6.96 10.29 7.46 10.18L12.74 9.08C13.52 8.92 13.7 7.93 13.02 7.55L1.18 0.95Z";
const HOLD_TO_COMMIT_MS = 1200;

function renderInlineStudyText(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);

  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (!part.startsWith("`") || !part.endsWith("`")) return part;

    return (
      <code key={`${part}-${index}`} className="lab-inline-code">
        {part.slice(1, -1)}
      </code>
    );
  });
}

function getStudyStory(study: LabStudy) {
  if (study.story?.length) return study.story;

  return [
    {
      heading: "the starting point",
      body: [study.thesis],
    },
    {
      heading: "what changes",
      body: study.points,
    },
  ];
}

function LabStudyStory({ study }: { study: LabStudy }) {
  const story = getStudyStory(study);

  return (
    <section className="lab-study-article" aria-label="study notes">
      {story.map((section) => (
        <div key={section.heading} className="lab-study-story-block">
          <h2 className="lab-study-section-heading">{section.heading}</h2>
          <div className="lab-study-story-body">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{renderInlineStudyText(paragraph)}</p>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function LabStudyRules({ rules }: { rules: LabStudy["rules"] }) {
  if (rules.length === 0) return null;

  return (
    <section className="lab-study-rule-section">
      <h2 className="lab-study-section-heading">rules I keep</h2>
      <div className="lab-study-rule-list" aria-label="rules">
        {rules.map((rule) => (
          <p key={rule.label} className="lab-study-rule-item">
            <span className="lab-study-rule-label">{rule.label}</span>{" "}
            <span className="lab-study-rule-value">{renderInlineStudyText(rule.value)}</span>
            {rule.note && (
              <>
                {" "}
                <span className="lab-study-rule-note">{renderInlineStudyText(rule.note)}</span>
              </>
            )}
          </p>
        ))}
      </div>
    </section>
  );
}

function LabStudyTechnicalArtifact({ artifact }: { artifact: LabStudy["technicalArtifact"] }) {
  if (!artifact) return null;

  return (
    <section className="lab-study-artifact-section" aria-label={artifact.title}>
      <pre className="lab-study-artifact">
        <code>
          <span className="lab-study-artifact__heading">## {artifact.title}</span>
          {"\n\n"}
          {artifact.body}
        </code>
      </pre>
      {artifact.caption && <p className="lab-study-artifact-caption">{artifact.caption}</p>}
    </section>
  );
}

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
  const [holdState, setHoldState] = useState<"idle" | "holding" | "complete">("idle");
  const completionTimer = useRef<number | null>(null);

  const clearCompletionTimer = useCallback(() => {
    if (completionTimer.current === null) return;
    window.clearTimeout(completionTimer.current);
    completionTimer.current = null;
  }, []);

  const startHold = useCallback(() => {
    clearCompletionTimer();
    setHoldState("holding");
    completionTimer.current = window.setTimeout(() => {
      completionTimer.current = null;
      setHoldState("complete");
    }, HOLD_TO_COMMIT_MS);
  }, [clearCompletionTimer]);

  const cancelHold = useCallback(() => {
    clearCompletionTimer();
    setHoldState((current) => (current === "complete" ? current : "idle"));
  }, [clearCompletionTimer]);

  const resetHold = useCallback(() => {
    clearCompletionTimer();
    setHoldState("idle");
  }, [clearCompletionTimer]);

  useEffect(() => clearCompletionTimer, [clearCompletionTimer]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (holdState !== "holding") startHold();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    cancelHold();
  };

  const label =
    holdState === "complete"
      ? "committed"
      : holdState === "holding"
        ? "release to cancel"
        : "hold to commit";
  const status =
    holdState === "complete"
      ? "action committed"
      : holdState === "holding"
        ? "holding intent"
        : "waiting for sustained input";

  return (
    <div className="lab-study-stage lab-study-stage--motion">
      <button
        type="button"
        aria-label="hold to commit motion sample"
        data-state={holdState}
        onBlur={cancelHold}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPointerCancel={cancelHold}
        onPointerDown={startHold}
        onPointerLeave={cancelHold}
        onPointerUp={cancelHold}
        className="lab-hold-action micro-focus"
      >
        <span className="lab-hold-action__content">
          <span className="lab-hold-action__glyph" aria-hidden="true" />
          <span>{label}</span>
        </span>
        <span className="lab-hold-action__overlay" aria-hidden="true">
          <span className="lab-hold-action__glyph" />
          <span>{label}</span>
        </span>
      </button>
      <div className="lab-hold-action__timeline" data-state={holdState} aria-hidden="true">
        <span />
      </div>
      <div className="lab-hold-action__meta">
        <p role="status">{status}</p>
        <button
          type="button"
          onClick={resetHold}
          className="lab-hold-action__reset micro-focus micro-pressable"
        >
          reset
        </button>
      </div>
      <p className="lab-hold-action__note">
        <span>slow confirmation</span>
        <span>fast release</span>
      </p>
    </div>
  );
}

function HoverRowDemo({ reduceMotion }: DemoProps) {
  const rows = [
    {
      title: "atlas",
      meta: "capstone in progress",
      detail: "quiet row feedback while the project stays unavailable",
      mark: "at",
    },
    {
      title: "sentinel",
      meta: "48-hour native ios mvp",
      detail: "preview handoff leads the hover so the row feels connected",
      mark: "se",
    },
    {
      title: "portfolio ai",
      meta: "ai intake website",
      detail: "copy moves just enough to feel awake without stealing focus",
      mark: "pa",
    },
  ] as const;
  const [activeIndex, setActiveIndex] = useState(1);
  const activeRow = rows[activeIndex];

  return (
    <div className="lab-study-stage lab-study-stage--split">
      <div className="lab-hover-list" aria-label="hover row samples">
        {rows.map((row, index) => (
          <button
            key={row.title}
            type="button"
            data-active={activeIndex === index}
            data-project-row="studies"
            aria-pressed={activeIndex === index}
            aria-label={`${row.title}: ${row.meta}`}
            onMouseEnter={() => setActiveIndex(index)}
            onPointerEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            className="lab-hover-row micro-focus"
          >
            <span className="project-row-copy lab-hover-row__copy">
              <span className="project-row-title-line--lateral lab-hover-row__title">{row.title}</span>
              <span className="project-row-meta lab-hover-row__meta">{row.meta}</span>
            </span>
            <span className="lab-hover-row__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
      <div className="lab-hover-preview" role="status" aria-label="active hover preview">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex}
            initial={reduceMotion ? false : { opacity: 0, x: 6, scale: 0.985, filter: "blur(7px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -4, scale: 0.995, filter: "blur(4px)" }}
            transition={reduceMotion ? tweens.none : { ...tweens.fast, duration: 0.14 }}
            className="lab-hover-preview__frame"
          >
            <span className="lab-hover-preview__eyebrow">active preview</span>
            <strong className="lab-hover-preview__title">{activeRow.title}</strong>
            <span className="lab-hover-preview__meta">{activeRow.detail}</span>
            <span className="lab-hover-preview__lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="lab-hover-preview__mark" aria-hidden="true">{activeRow.mark}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function RouteTransitionDemo({ reduceMotion }: DemoProps) {
  const sections = {
    work: [
      ["atlas", "capstone in progress"],
      ["sentinel", "native ios mvp"],
      ["portfolio ai", "ai intake website"],
    ],
    studies: [
      ["motion taste system", "micro-interaction rules"],
      ["hover row study", "project-row handoff"],
      ["route transition study", "content-only routing"],
    ],
  } as const;
  const tabs = Object.keys(sections) as Array<keyof typeof sections>;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("work");
  const content = sections[activeTab];

  return (
    <div className="lab-study-stage lab-route-stage">
      <div className="lab-route-shell" aria-label="route transition sample">
        <div className="lab-route-stable-zone">
          <div className="lab-route-intro">
            <span>minwook shin</span>
            <span>design engineer</span>
            <span>I design and build interfaces for AI-native products.</span>
          </div>
          <nav className="lab-route-tabs" aria-label="route study sections">
            {tabs.map((tab, index) => {
              const selected = activeTab === tab;

              return (
                <span key={tab} className="lab-route-tab-item">
                  <button
                    type="button"
                    aria-pressed={selected}
                    className="home-tab-button micro-focus micro-focus-tight"
                    data-active={selected ? "true" : "false"}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                  {index < tabs.length - 1 && (
                    <span aria-hidden="true" className="lab-route-tab-separator" role="presentation">
                      ,
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        </div>

        <div className="lab-route-path" role="status" aria-label="route study path">
          <span>/{activeTab}</span>
          <span>stable intro, changing content</span>
        </div>

        <AnimatePresence initial={false}>
          <motion.ul
            key={activeTab}
            initial={reduceMotion ? false : { opacity: 0, y: 7, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4, filter: "blur(3px)" }}
            transition={reduceMotion ? tweens.none : { ...tweens.fast, duration: 0.18 }}
            className="lab-route-list"
            aria-label={`${activeTab} route content`}
          >
            {content.map(([title, meta]) => (
              <li key={title} data-project-row={activeTab} className="lab-route-row">
                <span className="project-row-copy lab-route-row__copy">
                  <span className="project-row-title-line--lateral lab-route-row__title">{title}</span>
                  <span className="project-row-meta lab-route-row__meta">{meta}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

function CursorGlyph() {
  return (
    <svg viewBox="0 0 14 15" aria-hidden="true" className="lab-cursor-glyph">
      <path className="lab-cursor-glyph__outline" d={cursorGlyphPath} />
      <path className="lab-cursor-glyph__fill" d={cursorGlyphPath} />
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

const aiLoopSteps = [
  {
    label: "intent",
    meta: "what should change",
    detail: "Capture the user's goal before the model plans around the wrong target.",
  },
  {
    label: "plan",
    meta: "what happens next",
    detail: "Show the steps the system wants to take, especially when tools or external state are involved.",
  },
  {
    label: "action",
    meta: "model or tool call",
    detail: "Make the action concrete enough that a person can tell whether it belongs in the workflow.",
  },
  {
    label: "observation",
    meta: "what came back",
    detail: "Bring returned evidence into view instead of hiding it behind a confident final answer.",
  },
  {
    label: "eval",
    meta: "did it work",
    detail: "Check the output against the goal, then keep recurring failures as future regression tests.",
  },
  {
    label: "checkpoint",
    meta: "human judgment",
    detail: "Pause before irreversible or high-context actions so the user can steer, not rubber-stamp.",
  },
] as const;

function AiLoopDemo({ reduceMotion }: DemoProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const activeStep = aiLoopSteps[activeIndex];

  useEffect(() => {
    if (reduceMotion || manual) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % aiLoopSteps.length);
    }, 1450);

    return () => window.clearInterval(timer);
  }, [manual, reduceMotion]);

  const activateStep = (index: number) => {
    setManual(true);
    setActiveIndex(index);
  };

  return (
    <div className="lab-study-stage lab-loop-stage">
      <div className="lab-loop-list" aria-label="ai loop steps">
        {aiLoopSteps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            data-active={activeIndex === index}
            onMouseEnter={() => activateStep(index)}
            onPointerEnter={() => activateStep(index)}
            onFocus={() => activateStep(index)}
            onClick={() => activateStep(index)}
            className="lab-loop-row micro-focus"
          >
            <span className="lab-loop-row__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="lab-loop-row__copy">
              <span>{step.label}</span>
              <span>{step.meta}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="lab-loop-panel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep.label}
            initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -3, filter: "blur(3px)" }}
            transition={reduceMotion ? tweens.none : { ...tweens.fast, duration: 0.18 }}
            className="lab-loop-panel__content"
          >
            <span className="lab-loop-panel__eyebrow">{manual ? "selected step" : "looping trace"}</span>
            <strong>{activeStep.label}</strong>
            <p>{activeStep.detail}</p>
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setManual(false)}
          className="lab-loop-panel__control micro-focus micro-pressable"
        >
          resume loop
        </button>
      </div>
    </div>
  );
}

function LabStudyDemo({ kind, reduceMotion }: { kind: LabStudy["kind"]; reduceMotion: boolean }) {
  if (kind === "ai-loop") return <AiLoopDemo reduceMotion={reduceMotion} />;
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

  if (kind === "ai-loop") {
    return (
      <span className="lab-study-glyph lab-study-glyph--loop">
        <span />
        <span />
        <span />
        <span />
        <span className="lab-study-glyph__loop-dot" />
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
      <header className="lab-study-header">
        <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">
          {detailLabels[study.kind]}
        </p>
        <h1 className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
          {project.title}
        </h1>
        <p className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
          {renderInlineStudyText(study.thesis)}
        </p>
      </header>

      <LabStudyDemo kind={study.kind} reduceMotion={reduceMotion} />

      <LabStudyStory study={study} />

      <LabStudyTechnicalArtifact artifact={study.technicalArtifact} />

      <LabStudyRules rules={study.rules} />

      <section className="lab-study-code-section">
        <h2 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
          final code
        </h2>
        <pre className="lab-study-code"><code>{study.code}</code></pre>
      </section>
    </motion.article>
  );
}
