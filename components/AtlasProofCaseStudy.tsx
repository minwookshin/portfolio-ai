"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DetailOutlineHeading, DetailOutlineRow } from "@/components/Outline";
import {
  ATLAS_DECISION_LOG,
  ATLAS_EVENT_CONTRACT,
  ATLAS_INTRO,
  ATLAS_META,
  ATLAS_PATIENT_IMAGES,
  ATLAS_REFLECTION,
  ATLAS_TRIAGE_SEQUENCE,
  type AtlasImageItem,
} from "@/data/atlasProof";
import type { PortfolioProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";

type AtlasProofCaseStudyProps = {
  project: PortfolioProject;
};

type CapacityState = {
  action: string;
  beds: number;
  label: string;
  priority: string;
  tone: "calm" | "watch" | "critical";
};

const motionStates = [
  {
    label: "queued",
    caption: "patient update lands quietly",
  },
  {
    label: "assigned",
    caption: "row confirms the route change",
  },
  {
    label: "received",
    caption: "status settles without visual drama",
  },
] as const;

function getCapacityState(load: number): CapacityState {
  if (load >= 82) {
    return {
      action: "route lower acuity elsewhere",
      beds: 3,
      label: "divert",
      priority: "priority 1",
      tone: "critical",
    };
  }

  if (load >= 58) {
    return {
      action: "stage incoming patients",
      beds: 8,
      label: "strained",
      priority: "priority 2",
      tone: "watch",
    };
  }

  return {
    action: "receive next transport",
    beds: 16,
    label: "receiving",
    priority: "priority 3",
    tone: "calm",
  };
}

function AtlasTile({
  caption,
  children,
  className = "",
  label,
  title,
}: {
  caption: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
  title: string;
}) {
  return (
    <article className={`atlas-proof-tile ${className}`}>
      <div className="atlas-proof-tile__body">{children}</div>
      <div className="atlas-proof-tile__copy">
        <p className="atlas-proof-tile__title">
          {title}
          {label && <span>{label}</span>}
        </p>
        <p className="atlas-proof-tile__caption">{caption}</p>
      </div>
    </article>
  );
}

function AtlasImageSequence({ images }: { images: AtlasImageItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="atlas-sequence" aria-label="triage map sequence">
      <figure className="atlas-sequence__main">
        <img src={active.src} alt={active.alt} draggable={false} loading="lazy" decoding="async" />
      </figure>
      <div className="atlas-sequence__tabs" aria-label="sequence frames">
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

function AtlasPatientDetail() {
  return (
    <div className="atlas-patient-proof">
      {ATLAS_PATIENT_IMAGES.map((image) => (
        <figure key={image.src}>
          <img src={image.src} alt={image.alt} draggable={false} loading="lazy" decoding="async" />
          <figcaption>{image.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function AtlasCapacityTile() {
  const [load, setLoad] = useState(66);
  const state = useMemo(() => getCapacityState(load), [load]);

  return (
    <div className="atlas-capacity" data-tone={state.tone}>
      <div className="atlas-capacity__readout">
        <span>{state.label}</span>
        <output aria-live="polite">{load}% load</output>
      </div>
      <div className="atlas-capacity__meter" aria-hidden="true">
        <span style={{ width: `${load}%` }} />
      </div>
      <label className="atlas-capacity__slider">
        <span>hospital load</span>
        <input
          type="range"
          min="24"
          max="94"
          value={load}
          aria-label="hospital load"
          onChange={(event) => setLoad(Number(event.target.value))}
        />
      </label>
      <dl className="atlas-live-list">
        <div>
          <dt>beds</dt>
          <dd>{state.beds} open</dd>
        </div>
        <div>
          <dt>priority</dt>
          <dd>{state.priority}</dd>
        </div>
        <div>
          <dt>next</dt>
          <dd>{state.action}</dd>
        </div>
      </dl>
    </div>
  );
}

function AtlasMotionRuleTile() {
  const [stateIndex, setStateIndex] = useState(0);
  const state = motionStates[stateIndex] ?? motionStates[0];

  return (
    <div className="atlas-motion-rule" data-state={state.label}>
      <div className="atlas-motion-rule__panel" aria-live="polite">
        <span className="atlas-motion-rule__dot" />
        <div>
          <p>patient 18</p>
          <span>{state.caption}</span>
        </div>
        <strong>{state.label}</strong>
      </div>
      <button
        type="button"
        className="atlas-motion-rule__button micro-focus micro-pressable"
        onClick={() => setStateIndex((index) => (index + 1) % motionStates.length)}
      >
        advance state
      </button>
    </div>
  );
}

function AtlasCodeArtifact() {
  return (
    <div className="atlas-code-artifact">
      <div className="detail-artifact-header">
        <span>event contract</span>
        <span>case-study sketch</span>
      </div>
      <pre className="detail-artifact-code">
        <code>
          {ATLAS_EVENT_CONTRACT.split("\n").map((line, lineIndex) => (
            <span key={`${lineIndex}-${line}`} className="detail-artifact-code-line">
              {line || "\u00a0"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function AtlasDecisionLog() {
  return (
    <dl className="atlas-live-list atlas-live-list--log">
      {ATLAS_DECISION_LOG.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function AtlasProofCaseStudy({ project }: AtlasProofCaseStudyProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className="atlas-case detail-outline-stack"
      aria-labelledby="atlas-proof-title"
    >
      <section className="atlas-case__intro">
        <h1 id="atlas-proof-title">{ATLAS_INTRO.title}</h1>
        <p>{ATLAS_INTRO.body}</p>
      </section>

      <dl className="atlas-meta-block" aria-label="role, constraint, decision, and outcome">
        {ATLAS_META.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      <section className="atlas-proof-section">
        <DetailOutlineHeading heading="proof bento grid" eyebrow={project.builder.status.label} />
        <div className="atlas-proof-grid">
          <AtlasTile
            title="triage map"
            label="incident command flow"
            caption="A screenshot sequence showing how field, command, and receiving surfaces shared the same emergency picture."
            className="atlas-proof-tile--wide"
          >
            <AtlasImageSequence images={ATLAS_TRIAGE_SEQUENCE} />
          </AtlasTile>

          <AtlasTile
            title="capacity state"
            label="live interaction"
            caption="A small state model for hospital load, available beds, priority, and routing action."
            className="atlas-proof-tile--live"
          >
            <AtlasCapacityTile />
          </AtlasTile>

          <AtlasTile
            title="patient detail"
            label="scan density"
            caption="Dense patient data is grouped by role so responders and ER staff can scan different slices of the same state."
          >
            <AtlasPatientDetail />
          </AtlasTile>

          <AtlasTile
            title="event contract"
            label="code artifact"
            caption="The prototype needed a shared vocabulary before the app surfaces could feel connected."
            className="atlas-proof-tile--code"
          >
            <AtlasCodeArtifact />
          </AtlasTile>

          <AtlasTile
            title="motion rule"
            label="live interaction"
            caption="Emergency UI motion should confirm change, then get out of the way."
          >
            <AtlasMotionRuleTile />
          </AtlasTile>

          <AtlasTile
            title="decision log"
            label="context"
            caption="The hiring-readable layer: role, constraint, decision, and result without turning the page into a long essay."
          >
            <AtlasDecisionLog />
          </AtlasTile>
        </div>
      </section>

      <section className="detail-outline-section">
        <DetailOutlineHeading heading="short reflection" />
        <div className="detail-outline-list">
          {ATLAS_REFLECTION.map((line) => (
            <DetailOutlineRow key={line} body={line} />
          ))}
        </div>
      </section>
    </motion.article>
  );
}
