"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { InlineCopyButton } from "@/components/CopyFeedback";
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

function getHashLink(id: string) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.hash = id;
  return url.toString();
}

function AtlasTile({
  artifactType,
  caption,
  children,
  className = "",
  id,
  isSelected = false,
  label,
  onSelect,
  title,
}: {
  artifactType: "code" | "context" | "live" | "scan" | "sequence";
  caption: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  isSelected?: boolean;
  label?: string;
  onSelect?: (id: string) => void;
  title: string;
}) {
  const selectTile = () => {
    if (id) onSelect?.(id);
  };

  return (
    <article
      id={id}
      tabIndex={id ? 0 : undefined}
      className={`atlas-proof-tile ${className}`}
      data-selected={isSelected ? "true" : undefined}
      aria-label={`${title} proof tile${isSelected ? ", selected" : ""}`}
      onClick={selectTile}
      onFocusCapture={selectTile}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectTile();
        }
      }}
    >
      <div className="atlas-proof-tile__body">{children}</div>
      <div className="atlas-proof-tile__copy">
        <div className="atlas-proof-tile__title-row">
          <p className="atlas-proof-tile__title">
            {title}
            {label && <span>{label}</span>}
          </p>
          <span className="atlas-proof-tile__type">{artifactType}</span>
        </div>
        <p className="atlas-proof-tile__caption">{caption}</p>
        {id && isSelected && (
          <div className="atlas-proof-tile__actions">
            <span>selected</span>
            <InlineCopyButton
              value={() => getHashLink(id)}
              label={`${title} section link`}
              ariaLabel={`copy ${title} section link`}
              icon="link"
              className="atlas-proof-tile__action micro-focus micro-focus-tight micro-pressable"
            >
              copy link
            </InlineCopyButton>
            <a className="atlas-proof-tile__action micro-focus micro-focus-tight" href={`#${id}`}>
              open
            </a>
          </div>
        )}
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
        <div className="detail-artifact-header-actions">
          <span className="detail-artifact-header-meta">case-study sketch</span>
          <InlineCopyButton
            value={ATLAS_EVENT_CONTRACT}
            label="event contract artifact"
            ariaLabel="copy event contract artifact"
            className="detail-copy-action micro-focus micro-focus-tight micro-pressable"
          >
            copy
          </InlineCopyButton>
        </div>
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
  const [selectedTileId, setSelectedTileId] = useState("atlas-triage-map");

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

      <section className="atlas-meta-surface" aria-labelledby="atlas-meta-title">
        <div className="atlas-meta-surface__header">
          <span id="atlas-meta-title">artifact profile</span>
          <span>role / constraint / decision / outcome</span>
        </div>
        <dl className="atlas-meta-block" aria-label="role, constraint, decision, and outcome">
          {ATLAS_META.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="atlas-proof-bento" className="atlas-proof-section">
        <DetailOutlineHeading heading="proof bento grid" eyebrow={project.builder.status.label} />
        <div className="atlas-proof-grid">
          <AtlasTile
            id="atlas-triage-map"
            title="triage map"
            label="incident command flow"
            artifactType="sequence"
            caption="A screenshot sequence showing how field, command, and receiving surfaces shared the same emergency picture."
            className="atlas-proof-tile--wide"
            isSelected={selectedTileId === "atlas-triage-map"}
            onSelect={setSelectedTileId}
          >
            <AtlasImageSequence images={ATLAS_TRIAGE_SEQUENCE} />
          </AtlasTile>

          <AtlasTile
            id="atlas-capacity-state"
            title="capacity state"
            label="live interaction"
            artifactType="live"
            caption="A small state model for hospital load, available beds, priority, and routing action."
            className="atlas-proof-tile--live"
            isSelected={selectedTileId === "atlas-capacity-state"}
            onSelect={setSelectedTileId}
          >
            <AtlasCapacityTile />
          </AtlasTile>

          <AtlasTile
            id="atlas-patient-detail"
            title="patient detail"
            label="scan density"
            artifactType="scan"
            caption="Dense patient data is grouped by role so responders and ER staff can scan different slices of the same state."
            isSelected={selectedTileId === "atlas-patient-detail"}
            onSelect={setSelectedTileId}
          >
            <AtlasPatientDetail />
          </AtlasTile>

          <AtlasTile
            id="atlas-event-contract"
            title="event contract"
            label="code artifact"
            artifactType="code"
            caption="The prototype needed a shared vocabulary before the app surfaces could feel connected."
            className="atlas-proof-tile--code"
            isSelected={selectedTileId === "atlas-event-contract"}
            onSelect={setSelectedTileId}
          >
            <AtlasCodeArtifact />
          </AtlasTile>

          <AtlasTile
            id="atlas-motion-rule"
            title="motion rule"
            label="live interaction"
            artifactType="live"
            caption="Emergency UI motion should confirm change, then get out of the way."
            isSelected={selectedTileId === "atlas-motion-rule"}
            onSelect={setSelectedTileId}
          >
            <AtlasMotionRuleTile />
          </AtlasTile>

          <AtlasTile
            id="atlas-decision-log"
            title="decision log"
            label="context"
            artifactType="context"
            caption="The hiring-readable layer: role, constraint, decision, and result without turning the page into a long essay."
            isSelected={selectedTileId === "atlas-decision-log"}
            onSelect={setSelectedTileId}
          >
            <AtlasDecisionLog />
          </AtlasTile>
        </div>
      </section>

      <section id="atlas-reflection" className="detail-outline-section">
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
