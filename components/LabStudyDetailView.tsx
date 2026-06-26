"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
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
  "motion-curve": "motion rule system",
  "ai-loop": "ai interface study",
};

const HOLD_TO_COMMIT_MS = 1200;

type CurveEasing = "standard" | "in-out";

const motionRulePresets: Array<{
  label: string;
  useCase: string;
  duration: number;
  distance: number;
  easing: CurveEasing;
  token: string;
  note: string;
}> = [
  {
    label: "hover",
    useCase: "rows and links",
    duration: 180,
    distance: 18,
    easing: "standard",
    token: "tweens.fast",
    note: "short enough to disappear into the interaction",
  },
  {
    label: "preview",
    useCase: "media handoff",
    duration: 250,
    distance: 48,
    easing: "standard",
    token: "tweens.base",
    note: "lets the image arrive before the copy feels heavy",
  },
  {
    label: "route",
    useCase: "detail entry",
    duration: 350,
    distance: 72,
    easing: "in-out",
    token: "tweens.slowInOut",
    note: "reserved for larger spatial changes",
  },
];

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

function renderCodeLine(line: string) {
  const parts = line.split(/("[^"]*"|'[^']*'|`[^`]*`)/g).filter(Boolean);

  if (parts.length === 0) return "\u00a0";

  return parts.map((part, index) => {
    const isString =
      (part.startsWith("\"") && part.endsWith("\"")) ||
      (part.startsWith("'") && part.endsWith("'")) ||
      (part.startsWith("`") && part.endsWith("`"));

    if (!isString) return part;

    return (
      <span key={`${part}-${index}`} className="lab-code-token-string">
        {part}
      </span>
    );
  });
}

function getCodeLineClass(line: string) {
  const trimmed = line.trimStart();
  const isComment =
    trimmed.startsWith("#") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("##");

  return isComment ? "lab-code-line lab-code-line--comment" : "lab-code-line";
}

function StudyCodeBlock({
  children,
  className,
  heading,
}: {
  children: string;
  className: string;
  heading?: string;
}) {
  const source = heading ? `## ${heading}\n\n${children}` : children;
  const lines = source.split("\n");

  return (
    <pre className={className}>
      <code>
        {lines.map((line, index) => (
          <span key={`${index}-${line}`} className={getCodeLineClass(line)}>
            {renderCodeLine(line)}
          </span>
        ))}
      </code>
    </pre>
  );
}

function StudySectionHead({ heading, meta }: { heading: string; meta?: string }) {
  return (
    <div className="detail-outline-heading-row">
      <span className="detail-outline-bullet-cell" aria-hidden="true">
        <span className="detail-outline-bullet detail-outline-bullet--section" />
      </span>
      <div className="detail-outline-heading-copy">
        <h2 className="lab-study-section-heading">{heading}</h2>
        {meta && <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{meta}</p>}
      </div>
    </div>
  );
}

function StudyTextRow({ children }: { children: ReactNode }) {
  return (
    <div className="detail-outline-row">
      <span className="detail-outline-bullet-cell" aria-hidden="true">
        <span className="detail-outline-bullet" />
      </span>
      <p className="detail-outline-row-body">{children}</p>
    </div>
  );
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
    <section className="lab-study-article detail-outline-stack" aria-label="study notes">
      {story.map((section) => (
        <div key={section.heading} className="lab-study-story-block detail-outline-section">
          <StudySectionHead heading={section.heading} />
          <div className="lab-study-story-body detail-outline-list">
            {section.body.map((paragraph) => (
              <StudyTextRow key={paragraph}>{renderInlineStudyText(paragraph)}</StudyTextRow>
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
    <section className="lab-study-rule-section detail-outline-section">
      <StudySectionHead heading="rules I keep" />
      <div className="lab-study-rule-list detail-outline-list" aria-label="rules">
        {rules.map((rule) => (
          <div key={rule.label} className="detail-outline-row">
            <span className="detail-outline-bullet-cell" aria-hidden="true">
              <span className="detail-outline-bullet" />
            </span>
            <div className="detail-outline-row-copy">
              <p className="lab-study-rule-item">
                <span className="lab-study-rule-label">{rule.label}</span>{" "}
                <span className="lab-study-rule-value">{renderInlineStudyText(rule.value)}</span>
                {rule.note && (
                  <>
                    {" "}
                    <span className="lab-study-rule-note">{renderInlineStudyText(rule.note)}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LabStudyTechnicalArtifact({ artifact }: { artifact: LabStudy["technicalArtifact"] }) {
  if (!artifact) return null;

  return (
    <section className="lab-study-artifact-section" aria-label={artifact.title}>
      <StudySectionHead heading="technical artifact" meta={artifact.title} />
      <StudyCodeBlock className="lab-study-artifact" heading={artifact.title}>
        {artifact.body}
      </StudyCodeBlock>
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
      meta: "digital prototype system",
      detail: "quiet row feedback while the project opens into build proof",
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
      ["atlas", "digital prototype system"],
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

const cursorStudyTargets: Array<{ label: string; note: string; cursor: "idle" | "interactive" | "native" }> = [
  { label: "default surface", note: "quiet arrow", cursor: "idle" },
  { label: "interactive text", note: "subtle press state", cursor: "interactive" },
  { label: "precision zone", note: "native cursor wins", cursor: "native" },
];

function CursorStudyDemo() {
  const [activeTarget, setActiveTarget] = useState<number | null>(null);

  return (
    <div
      className="lab-study-stage lab-cursor-stage"
      onPointerLeave={() => setActiveTarget(null)}
    >
      <div className="lab-cursor-targets">
        {cursorStudyTargets.map((target, index) => (
          <button
            key={target.label}
            type="button"
            aria-pressed={activeTarget === index}
            data-active={activeTarget === index}
            data-cursor={target.cursor}
            onPointerEnter={() => setActiveTarget(index)}
            onFocus={() => setActiveTarget(index)}
            onClick={() => setActiveTarget(index)}
            className="lab-cursor-target micro-focus"
          >
            <span className="lab-cursor-target__label">{target.label}</span>
            <span className="lab-cursor-target__note" aria-hidden="true">{target.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MotionCurveTesterDemo({ reduceMotion }: DemoProps) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [replayNonce, setReplayNonce] = useState(0);
  const activePreset = motionRulePresets[activeIndex];
  const ease = activePreset.easing === "standard" ? motionEasings.standard : motionEasings.inOut;
  const animationKey = `${activePreset.label}-${replayNonce}`;
  const trackStyle = { "--curve-distance": `${activePreset.distance}px` } as CSSProperties;

  return (
    <div className="lab-study-stage lab-curve-tool">
      <div className="lab-curve-copy">
        <p>Motion should come from a small set of decisions, not a slider hunt.</p>
        <p>{activePreset.label}: {activePreset.note}</p>
      </div>

      <div className="lab-curve-presets" aria-label="motion presets">
        {motionRulePresets.map((preset, index) => (
          <StudyButton
            key={preset.label}
            active={activeIndex === index}
            onClick={() => {
              setActiveIndex(index);
              setReplayNonce((key) => key + 1);
            }}
          >
            {preset.label}
          </StudyButton>
        ))}
      </div>

      <div className="lab-curve-track" style={trackStyle}>
        <div className="lab-curve-lane" aria-label={`${activePreset.label} motion preview`}>
          <span className="lab-curve-axis" aria-hidden="true" />
          <span className="lab-curve-marker lab-curve-marker--start" aria-hidden="true" />
          <span className="lab-curve-marker lab-curve-marker--target" aria-hidden="true" />
          <motion.span
            key={animationKey}
            initial={reduceMotion ? false : { x: 0 }}
            animate={{ x: activePreset.distance }}
            transition={reduceMotion ? tweens.none : { type: "tween", duration: activePreset.duration / 1000, ease }}
            className="lab-curve-object"
          />
        </div>
        <div className="lab-curve-readout" aria-live="polite">
          <span>{activePreset.token}</span>
          <span>{activePreset.duration}ms</span>
          <span>{activePreset.easing} easing</span>
        </div>
      </div>

      <div className="lab-curve-rule-card" aria-live="polite">
        <span>use when</span>
        <strong>{activePreset.useCase}</strong>
        <p>Move {activePreset.distance}px over {activePreset.duration}ms with {activePreset.easing} easing.</p>
        <button
          type="button"
          onClick={() => setReplayNonce((key) => key + 1)}
          className="lab-study-control micro-focus micro-pressable"
        >
          replay
        </button>
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
            aria-pressed={activeIndex === index}
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
        <div className="lab-loop-panel__trace" aria-hidden="true">
          <div className="lab-loop-panel__trace-line">
            <motion.span
              animate={{ scaleX: (activeIndex + 1) / aiLoopSteps.length }}
              transition={reduceMotion ? tweens.none : { ...tweens.fast, duration: 0.22 }}
            />
          </div>
          <div className="lab-loop-panel__trace-nodes">
            {aiLoopSteps.map((step, index) => (
              <span
                key={step.label}
                data-active={activeIndex === index}
                data-passed={index < activeIndex}
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep.label}
            initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -3, filter: "blur(3px)" }}
            transition={reduceMotion ? tweens.none : { ...tweens.fast, duration: 0.18 }}
            className="lab-loop-panel__content"
          >
            <span className="lab-loop-panel__eyebrow">
              {manual ? "selected node" : "looping trace"} / {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <strong>{activeStep.label}</strong>
            <span className="lab-loop-panel__meta">{activeStep.meta}</span>
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
  if (kind === "cursor-study") return <CursorStudyDemo />;
  return <MotionCurveTesterDemo reduceMotion={reduceMotion} />;
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

      <section className="lab-study-demo-section detail-outline-section">
        <StudySectionHead heading="prototype" meta={detailLabels[study.kind]} />
        <LabStudyDemo kind={study.kind} reduceMotion={reduceMotion} />
      </section>

      <LabStudyStory study={study} />

      <LabStudyTechnicalArtifact artifact={study.technicalArtifact} />

      <LabStudyRules rules={study.rules} />

      <section className="lab-study-code-section">
        <StudySectionHead heading="final code" />
        <StudyCodeBlock className="lab-study-code">
          {study.code}
        </StudyCodeBlock>
      </section>
    </motion.article>
  );
}
