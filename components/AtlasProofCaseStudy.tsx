"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DetailOutlineHeading, DetailOutlineRow } from "@/components/Outline";
import {
  ATLAS_DECISION_LOG,
  ATLAS_EVENT_CONTRACTS,
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

const railItems = [
  {
    id: "patients",
    icon: "/projects/atlas/ui/patient_ic.png",
    label: "Patients",
  },
  {
    id: "hospitals",
    icon: "/projects/atlas/ui/hospital_ic.png",
    label: "Hospitals",
  },
  {
    id: "instructions",
    icon: "/projects/atlas/ui/instruction_ic.png",
    label: "Instructions",
  },
] as const;

const assignmentHospitals = [
  {
    id: "grady",
    eta: "18 min",
    label: "Grady",
    load: "8 open",
    suggested: true,
  },
  {
    id: "emory",
    eta: "24 min",
    label: "Emory",
    load: "5 open",
    suggested: false,
  },
] as const;

type AssignmentState = "ready" | "assigning" | "sent";

const assignmentStateCopy: Record<AssignmentState, { button: string; status: string }> = {
  ready: {
    button: "Confirm",
    status: "suggested route ready",
  },
  assigning: {
    button: "Assigning...",
    status: "sending instruction",
  },
  sent: {
    button: "Sent",
    status: "hospital assigned",
  },
};

const capacitySteps = [
  { label: "receiving", load: 42 },
  { label: "strained", load: 66 },
  { label: "divert", load: 88 },
] as const;

const patientRowStates = [
  {
    label: "queued",
    sector: "sector b",
    triage: "red",
    vitals: "hr 124 · spo2 91",
    note: "field update",
  },
  {
    label: "assigned",
    sector: "grady",
    triage: "red",
    vitals: "hr 118 · spo2 93",
    note: "route sent",
  },
  {
    label: "received",
    sector: "er bay 04",
    triage: "orange",
    vitals: "hr 104 · spo2 96",
    note: "intake ok",
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
  artifactType,
  caption,
  children,
  className = "",
  id,
  label,
  title,
}: {
  artifactType: "code" | "context" | "live" | "scan" | "sequence";
  caption: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  label?: string;
  title: string;
}) {
  return (
    <article
      id={id}
      className={`atlas-proof-tile ${className}`}
      aria-label={`${title} proof tile`}
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
          <img src={image.src} alt={image.alt} draggable={false} loading="eager" decoding="async" />
          <figcaption>{image.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function AtlasIncidentRailTile() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<(typeof railItems)[number]["id"]>("patients");

  return (
    <div className="atlas-rail-demo" data-expanded={isExpanded ? "true" : undefined}>
      <div className="atlas-rail" aria-label="Atlas incident command rail">
        <button
          type="button"
          className="atlas-rail__header micro-focus micro-pressable"
          aria-expanded={isExpanded}
          aria-label="toggle Atlas rail"
          onClick={() => setIsExpanded((value) => !value)}
        >
          <span className="atlas-rail__icon-cell">
            <img src="/projects/atlas/ui/atlaslogo_ic.png" alt="" draggable={false} />
          </span>
          <span className="atlas-rail__label">ATLAS</span>
        </button>
        <div className="atlas-rail__items">
          {railItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="atlas-rail__item micro-focus micro-pressable"
              data-active={activeItem === item.id ? "true" : undefined}
              onClick={() => setActiveItem(item.id)}
            >
              <span className="atlas-rail__icon-cell">
                <img src={item.icon} alt="" draggable={false} />
              </span>
              <span className="atlas-rail__label">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="atlas-rail__footer">
          <span className="atlas-rail__live-dot" aria-hidden="true" />
          <span className="atlas-rail__label">LIVE</span>
        </div>
      </div>
    </div>
  );
}

function AtlasAssignControlTile() {
  const [selectedHospital, setSelectedHospital] = useState<(typeof assignmentHospitals)[number]["id"]>("grady");
  const [assignmentState, setAssignmentState] = useState<AssignmentState>("ready");
  const copy = assignmentStateCopy[assignmentState];
  const assignmentSteps: AssignmentState[] = ["ready", "assigning", "sent"];

  useEffect(() => {
    if (assignmentState === "assigning") {
      const timer = window.setTimeout(() => setAssignmentState("sent"), 520);
      return () => window.clearTimeout(timer);
    }

    if (assignmentState === "sent") {
      const timer = window.setTimeout(() => setAssignmentState("ready"), 1600);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [assignmentState]);

  return (
    <div className="atlas-assign" data-state={assignmentState}>
      <div className="atlas-assign__cards" aria-label="hospital options">
        {assignmentHospitals.map((hospital) => (
          <button
            key={hospital.id}
            type="button"
            className="atlas-assign-card micro-focus micro-pressable"
            data-active={selectedHospital === hospital.id ? "true" : undefined}
            onClick={() => {
              setSelectedHospital(hospital.id);
              setAssignmentState("ready");
            }}
          >
            <span>
              <strong>{hospital.label}</strong>
              {hospital.suggested && <em>AI suggested</em>}
            </span>
            <span>
              <b>{hospital.eta}</b>
              <small>{hospital.load}</small>
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="atlas-assign__confirm micro-focus micro-pressable"
        aria-label="assign selected hospital"
        disabled={assignmentState === "assigning"}
        onClick={() => setAssignmentState("assigning")}
      >
        {assignmentState === "assigning" && <span className="atlas-assign__spinner" aria-hidden="true" />}
        {copy.button}
      </button>
      <div className="atlas-state-rail" aria-label="assignment states">
        {assignmentSteps.map((step) => (
          <span
            key={step}
            className="atlas-state-dot"
            data-active={assignmentState === step ? "true" : undefined}
            aria-label={step}
          />
        ))}
      </div>
      <p className="atlas-assign__status" aria-live="polite">
        {copy.status}
      </p>
    </div>
  );
}

function AtlasCapacityTile() {
  const [stepIndex, setStepIndex] = useState(1);
  const step = capacitySteps[stepIndex] ?? capacitySteps[0];
  const state = useMemo(() => getCapacityState(step.load), [step.load]);

  return (
    <div className="atlas-capacity" data-tone={state.tone}>
      <div className="atlas-capacity__readout">
        <span>{state.label}</span>
        <output aria-live="polite">{step.load}% load</output>
      </div>
      <div className="atlas-capacity__meter" aria-hidden="true">
        <span style={{ width: `${step.load}%` }} />
      </div>
      <div className="atlas-state-rail atlas-state-rail--controls" aria-label="hospital load states">
        {capacitySteps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className="atlas-state-dot micro-focus micro-pressable"
            data-active={index === stepIndex ? "true" : undefined}
            aria-label={`set hospital load to ${item.label}`}
            onClick={() => setStepIndex(index)}
          />
        ))}
      </div>
      <button
        type="button"
        className="atlas-progress-control micro-focus micro-pressable"
        aria-label="advance hospital load"
        onClick={() => setStepIndex((index) => (index + 1) % capacitySteps.length)}
      >
        advance load
      </button>
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

function AtlasPatientRowTile() {
  const [patientIndex, setPatientIndex] = useState(0);
  const patient = patientRowStates[patientIndex] ?? patientRowStates[0];

  return (
    <div className="atlas-patient-row-demo" data-state={patient.label}>
      <button
        type="button"
        className="atlas-patient-row-card micro-focus micro-pressable"
        aria-label="advance patient row state"
        onClick={() => setPatientIndex((index) => (index + 1) % patientRowStates.length)}
      >
        <span className="atlas-patient-row-card__matrix" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="atlas-patient-row-card__body">
          <span className="atlas-patient-row-card__main">
            <strong>patient 18</strong>
            <em>{patient.label}</em>
          </span>
          <span className="atlas-patient-row-card__meta">
            <span>{patient.sector}</span>
            <span>{patient.vitals}</span>
          </span>
          <span className="atlas-patient-row-card__note">{patient.note}</span>
        </span>
        <span className="atlas-patient-row-card__triage">{patient.triage}</span>
      </button>
      <div className="atlas-state-rail atlas-state-rail--controls" aria-label="patient row states">
        {patientRowStates.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className="atlas-state-dot micro-focus micro-pressable"
            data-active={index === patientIndex ? "true" : undefined}
            aria-label={`set patient row to ${item.label}`}
            onClick={() => setPatientIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

function AtlasMotionRuleTile() {
  const [stateIndex, setStateIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const state = motionStates[stateIndex] ?? motionStates[0];

  useEffect(() => {
    if (reduceMotion) return undefined;

    const timer = window.setInterval(() => {
      setStateIndex((index) => (index + 1) % motionStates.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

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
  const [activeIndex, setActiveIndex] = useState(0);
  const activeContract = ATLAS_EVENT_CONTRACTS[activeIndex] ?? ATLAS_EVENT_CONTRACTS[0];

  return (
    <div className="atlas-code-artifact">
      <div className="detail-artifact-header">
        <span>event contract</span>
        <div className="detail-artifact-header-actions">
          <span className="detail-artifact-header-meta">case-study sketch</span>
        </div>
      </div>
      <div className="atlas-code-artifact__tabs" aria-label="event contract variants">
        {ATLAS_EVENT_CONTRACTS.map((contract, index) => (
          <button
            key={contract.label}
            type="button"
            className="micro-focus micro-pressable"
            data-active={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          >
            {contract.label}
          </button>
        ))}
      </div>
      <pre className="detail-artifact-code">
        <code>
          {activeContract.code.split("\n").map((line, lineIndex) => (
            <span key={`${lineIndex}-${line}`} className="detail-artifact-code-line">
              {line || "\u00a0"}
            </span>
          ))}
        </code>
      </pre>
      <p className="atlas-code-artifact__note">{activeContract.note}</p>
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

      <section className="atlas-meta-surface" aria-labelledby="atlas-meta-title">
        <div className="atlas-meta-surface__header">
          <span id="atlas-meta-title">profile</span>
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
            caption="one emergency picture across field, command, and receiving."
            className="atlas-proof-tile--wide"
          >
            <AtlasImageSequence images={ATLAS_TRIAGE_SEQUENCE} />
          </AtlasTile>

          <AtlasTile
            id="atlas-capacity-state"
            title="capacity state"
            label="routing state"
            artifactType="live"
            caption="hospital load changes beds, priority, and routing action."
            className="atlas-proof-tile--live"
          >
            <AtlasCapacityTile />
          </AtlasTile>

          <AtlasTile
            id="atlas-incident-rail"
            title="incident rail"
            label="xcode rail"
            artifactType="live"
            caption="the iPad rail widens first; labels arrive a beat later."
            className="atlas-proof-tile--rail"
          >
            <AtlasIncidentRailTile />
          </AtlasTile>

          <AtlasTile
            id="atlas-assign-control"
            title="assign control"
            label="assignment state"
            artifactType="live"
            caption="hospital choice, confirm, and sent feedback stay in one control loop."
            className="atlas-proof-tile--assign"
          >
            <AtlasAssignControlTile />
          </AtlasTile>

          <AtlasTile
            id="atlas-patient-row"
            title="patient row"
            label="row contract"
            artifactType="live"
            caption="one row carries triage, location, vitals, and confirmation."
            className="atlas-proof-tile--patient-row"
          >
            <AtlasPatientRowTile />
          </AtlasTile>

          <AtlasTile
            id="atlas-patient-detail"
            title="patient detail"
            label="scan density"
            artifactType="scan"
            caption="same patient state, different operational views."
            className="atlas-proof-tile--patient"
          >
            <AtlasPatientDetail />
          </AtlasTile>

          <AtlasTile
            id="atlas-event-contract"
            title="event contract"
            label="code artifact"
            artifactType="code"
            caption="the shared vocabulary behind the connected prototype."
            className="atlas-proof-tile--code"
          >
            <AtlasCodeArtifact />
          </AtlasTile>

          <AtlasTile
            id="atlas-motion-rule"
            title="motion rule"
            label="motion grammar"
            artifactType="live"
            caption="confirm change, then get out of the way."
            className="atlas-proof-tile--motion"
          >
            <AtlasMotionRuleTile />
          </AtlasTile>

          <AtlasTile
            id="atlas-decision-log"
            title="decision log"
            label="context"
            artifactType="context"
            caption="role, constraint, decision, result."
            className="atlas-proof-tile--log"
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
