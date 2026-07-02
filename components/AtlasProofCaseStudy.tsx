"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DetailOutlineHeading, DetailOutlineRow } from "@/components/Outline";
import ProjectCaseStudyEntry from "@/components/ProjectCaseStudyEntry";
import {
  ATLAS_DECISION_LOG,
  ATLAS_EVENT_CONTRACTS,
  ATLAS_INTRO,
  ATLAS_META,
  ATLAS_REFLECTION,
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
    address: "450 Pine St 31404, SAV",
    eta: "5 min away",
    label: "Memorial Health",
    load: "11/23",
    suggested: true,
  },
  {
    id: "emory",
    address: "120 W Main St 31405, SAV",
    eta: "11 min away",
    label: "County General",
    load: "7/20",
    suggested: false,
  },
  {
    id: "st-marys",
    address: "300E Broad St 31401, SAV",
    eta: "11 min away",
    label: "St Mary's",
    load: "0/28",
    suggested: false,
  },
] as const;

const quickSendActions = [
  "Re-triage",
  "Check Patient",
  "Prep transport",
  "Move to sector",
  "Secure airway",
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
    age: "30s",
    eta: "3-5min",
    injury: "Penetrating chest trauma",
    label: "incoming",
    sector: "Sector A",
    triage: "red",
    vitals: "SpO2 91% · HR 118 · BP 118/79",
    note: "02 · Male",
  },
  {
    age: "50s",
    eta: "5-7min",
    injury: "Severe head trauma",
    label: "assigned",
    sector: "Memorial Health",
    triage: "red",
    vitals: "SpO2 75% · HR 130 · BP 90/60",
    note: "05 · Female",
  },
  {
    age: "40s",
    eta: "10-15min",
    injury: "Blunt abdominal injury",
    label: "received",
    sector: "ER bay 04",
    triage: "orange",
    vitals: "SpO2 88% · HR 105 · BP 110/70",
    note: "03 · Female",
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

function AtlasVisualTile({
  children,
  className = "",
  id,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  label: string;
}) {
  return (
    <article
      id={id}
      className={`atlas-proof-tile ${className}`}
      aria-label={label}
    >
      <div className="atlas-proof-tile__body">{children}</div>
    </article>
  );
}

function AtlasTriagePill({ tone, label }: { tone: "green" | "orange" | "red"; label: string }) {
  return (
    <span className="atlas-ui-triage" data-tone={tone}>
      {label}
      <span aria-hidden="true" />
    </span>
  );
}

function AtlasGripDots() {
  return (
    <span className="atlas-ui-grip" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <span key={index} />
      ))}
    </span>
  );
}

function AtlasPatientRow({
  active,
  patient,
  onSelect,
}: {
  active?: boolean;
  patient: (typeof patientRowStates)[number];
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      className="atlas-ui-patient-row micro-focus micro-pressable"
      data-active={active ? "true" : undefined}
      aria-label={`select ${patient.note}`}
      onClick={onSelect}
    >
      <AtlasGripDots />
      <span className="atlas-ui-patient-row__content">
        <span className="atlas-ui-patient-row__top">
          <strong>{patient.note}</strong>
          <em>{patient.age}</em>
          <AtlasTriagePill tone={patient.triage === "orange" ? "orange" : "red"} label={patient.triage} />
        </span>
        <span className="atlas-ui-patient-row__bottom">
          <span>At: {patient.sector}</span>
          <span>{patient.vitals}</span>
        </span>
      </span>
    </button>
  );
}

function AtlasIncidentCommandScene() {
  const [activeItem, setActiveItem] = useState<(typeof railItems)[number]["id"]>("patients");
  const [selectedHospital, setSelectedHospital] = useState<(typeof assignmentHospitals)[number]["id"]>("grady");
  const [assignmentState, setAssignmentState] = useState<AssignmentState>("ready");
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
    <div className="atlas-visual-stage atlas-visual-stage--command">
      <div className="atlas-ic-ui" data-panel={activeItem}>
        <aside className="atlas-ic-ui__rail" aria-label="Atlas incident command rail">
          <div className="atlas-ic-ui__brand">
            <img src="/projects/atlas/ui/atlaslogo_ic.png" alt="" draggable={false} />
          </div>
          <div className="atlas-ic-ui__tabs">
            {railItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="micro-focus micro-pressable"
                data-active={activeItem === item.id ? "true" : undefined}
                aria-label={`show ${item.label}`}
                onClick={() => setActiveItem(item.id)}
              >
                <img src={item.icon} alt="" draggable={false} />
              </button>
            ))}
          </div>
          <span className="atlas-ic-ui__live" aria-hidden="true" />
        </aside>

        <main className="atlas-ic-ui__map" aria-label="incident command interface">
          <div className="atlas-map-buildings" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <span className="atlas-map-route atlas-map-route--one" aria-hidden="true" />
          <span className="atlas-map-route atlas-map-route--two" aria-hidden="true" />
          <span className="atlas-map-pin atlas-map-pin--red" aria-hidden="true" />
          <span className="atlas-map-pin atlas-map-pin--blue" aria-hidden="true" />
          <span className="atlas-map-pin atlas-map-pin--green" aria-hidden="true" />

          <section className="atlas-ic-ui__sheet" aria-live="polite">
            {activeItem === "hospitals" ? (
              <>
                <div className="atlas-ui-sheet-header">
                  <span>Assign to Hospital - 02</span>
                  <span>14:47</span>
                </div>
                <div className="atlas-ui-hospital-list">
                  {assignmentHospitals.map((hospital) => (
                    <button
                      key={hospital.id}
                      type="button"
                      className="atlas-ui-hospital-card micro-focus micro-pressable"
                      data-active={selectedHospital === hospital.id ? "true" : undefined}
                      onClick={() => {
                        setSelectedHospital(hospital.id);
                        setAssignmentState("ready");
                      }}
                    >
                      <span>
                        <strong>{hospital.label}</strong>
                        <small>{hospital.address}</small>
                        {hospital.suggested && <em>AI Suggested</em>}
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
                  className="atlas-ui-confirm micro-focus micro-pressable"
                  aria-label="assign selected hospital"
                  disabled={assignmentState === "assigning"}
                  onClick={() => setAssignmentState("assigning")}
                >
                  {assignmentState === "assigning" && <span className="atlas-ui-spinner" aria-hidden="true" />}
                  {assignmentStateCopy[assignmentState].button}
                </button>
                <div className="atlas-state-rail atlas-state-rail--compact" aria-label="assignment states">
                  {assignmentSteps.map((step) => (
                    <span
                      key={step}
                      className="atlas-state-dot"
                      data-active={assignmentState === step ? "true" : undefined}
                      aria-label={step}
                    />
                  ))}
                </div>
              </>
            ) : activeItem === "instructions" ? (
              <>
                <div className="atlas-ui-sheet-header">
                  <span>Instruction</span>
                  <span>02</span>
                </div>
                <div className="atlas-ui-action-list">
                  {quickSendActions.map((action, index) => (
                    <button
                      key={action}
                      type="button"
                      className="atlas-ui-action micro-focus micro-pressable"
                      data-active={index === 1 ? "true" : undefined}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="atlas-ui-sheet-header">
                  <span>Patient Status - 03</span>
                  <span>14:52</span>
                </div>
                <AtlasPatientRow patient={patientRowStates[0]} active />
                <div className="atlas-ui-vitals-grid">
                  <span>132 HR</span>
                  <span>84% SpO2</span>
                  <span>82/54 BP</span>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function AtlasEmergencyRoomScene() {
  const [stepIndex, setStepIndex] = useState(1);
  const [patientIndex, setPatientIndex] = useState(0);
  const step = capacitySteps[stepIndex] ?? capacitySteps[0];
  const state = useMemo(() => getCapacityState(step.load), [step.load]);
  const selectedPatient = patientRowStates[patientIndex] ?? patientRowStates[0];

  return (
    <div className="atlas-visual-stage atlas-visual-stage--er">
      <div className="atlas-er-ui" data-tone={state.tone}>
        <aside className="atlas-er-ui__rail" aria-hidden="true">
          <span />
          <span />
        </aside>
        <section className="atlas-er-ui__content" aria-label="emergency room interface">
          <div className="atlas-er-ui__list">
            <header>
              <span>COUNTY GENERAL</span>
              <button
                type="button"
                className="micro-focus micro-pressable"
                aria-label="advance hospital load"
                onClick={() => setStepIndex((index) => (index + 1) % capacitySteps.length)}
              >
                {step.load}%
              </button>
            </header>
            <div className="atlas-er-ui__meter" aria-hidden="true">
              <span style={{ width: `${step.load}%` }} />
            </div>
            <div className="atlas-er-ui__rows">
              {patientRowStates.map((patient, index) => (
                <AtlasPatientRow
                  key={patient.label}
                  patient={patient}
                  active={index === patientIndex}
                  onSelect={() => setPatientIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="atlas-er-ui__detail" aria-live="polite">
            <div className="atlas-er-ui__stat-row">
              <span>
                <b>{state.priority}</b>
                incoming
              </span>
              <span>
                <b>{state.beds}</b>
                open beds
              </span>
              <span>
                <b>{selectedPatient.eta}</b>
                eta
              </span>
            </div>
            <div className="atlas-er-ui__chart" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="atlas-er-ui__note">
              <strong>{selectedPatient.injury}</strong>
              <span>{state.action}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AtlasResponderScene() {
  const [patientIndex, setPatientIndex] = useState(0);
  const patient = patientRowStates[patientIndex] ?? patientRowStates[0];

  return (
    <div className="atlas-visual-stage atlas-visual-stage--phone">
      <div className="atlas-phone-ui" aria-label="field responder interface">
        <div className="atlas-phone-ui__notch" aria-hidden="true" />
        <div className="atlas-phone-ui__map" aria-hidden="true">
          <span className="atlas-map-route atlas-map-route--phone" />
          <span className="atlas-map-pin atlas-map-pin--red" />
          <span className="atlas-map-pin atlas-map-pin--green" />
        </div>
        <div className="atlas-phone-ui__sheet">
          <AtlasPatientRow
            patient={patient}
            active
            onSelect={() => setPatientIndex((index) => (index + 1) % patientRowStates.length)}
          />
          <button
            type="button"
            className="atlas-phone-ui__cta micro-focus micro-pressable"
            aria-label="advance patient row state"
            onClick={() => setPatientIndex((index) => (index + 1) % patientRowStates.length)}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

function AtlasInstructionScene() {
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
    <div className="atlas-visual-stage atlas-visual-stage--instruction">
      <div className="atlas-instruction-ui" data-state={state.label} aria-label="instruction interface">
        <div className="atlas-instruction-ui__toast" aria-live="polite">
          <span>14:47</span>
          <strong>Patient 02</strong>
        </div>
        <div className="atlas-ui-action-list">
          {quickSendActions.slice(0, 4).map((action, index) => (
            <button
              key={action}
              type="button"
              className="atlas-ui-action micro-focus micro-pressable"
              data-active={index === stateIndex ? "true" : undefined}
              onClick={() => setStateIndex(index)}
            >
              {action}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="atlas-instruction-ui__send micro-focus micro-pressable"
          aria-label="advance state"
          onClick={() => setStateIndex((index) => (index + 1) % motionStates.length)}
        >
          {state.label}
        </button>
      </div>
    </div>
  );
}

function AtlasQuickActionScene() {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="atlas-visual-stage atlas-visual-stage--mini">
      <div className="atlas-mini-panel atlas-mini-panel--actions" aria-label="quick send interface">
        <div className="atlas-ui-sheet-header">
          <span>Instruction</span>
          <span>02</span>
        </div>
        <div className="atlas-ui-action-list">
          {quickSendActions.map((action, index) => (
            <button
              key={action}
              type="button"
              className="atlas-ui-action micro-focus micro-pressable"
              data-active={activeIndex === index ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AtlasHospitalStackScene() {
  const [selectedHospital, setSelectedHospital] = useState<(typeof assignmentHospitals)[number]["id"]>("grady");
  const [assignmentState, setAssignmentState] = useState<AssignmentState>("ready");

  useEffect(() => {
    if (assignmentState !== "assigning") return undefined;

    const timer = window.setTimeout(() => setAssignmentState("sent"), 520);
    return () => window.clearTimeout(timer);
  }, [assignmentState]);

  return (
    <div className="atlas-visual-stage atlas-visual-stage--mini">
      <div className="atlas-mini-panel atlas-mini-panel--hospital" aria-label="hospital assignment interface">
        <div className="atlas-ui-sheet-header">
          <span>Assign to Hospital - 02</span>
          <span>14:47</span>
        </div>
        <div className="atlas-ui-hospital-list">
          {assignmentHospitals.map((hospital) => (
            <button
              key={hospital.id}
              type="button"
              className="atlas-ui-hospital-card micro-focus micro-pressable"
              data-active={selectedHospital === hospital.id ? "true" : undefined}
              onClick={() => {
                setSelectedHospital(hospital.id);
                setAssignmentState("ready");
              }}
            >
              <span>
                <strong>{hospital.label}</strong>
                <small>{hospital.address}</small>
                {hospital.suggested && <em>AI Suggested</em>}
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
          className="atlas-ui-confirm micro-focus micro-pressable"
          aria-label="confirm hospital assignment"
          disabled={assignmentState === "assigning"}
          onClick={() => setAssignmentState("assigning")}
        >
          {assignmentState === "assigning" && <span className="atlas-ui-spinner" aria-hidden="true" />}
          {assignmentStateCopy[assignmentState].button}
        </button>
      </div>
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
          <span className="detail-artifact-header-meta">system sketch</span>
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

export default function AtlasProofCaseStudy(_props: AtlasProofCaseStudyProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      className="atlas-case detail-outline-stack"
      aria-labelledby="atlas-proof-title"
    >
      <section className="atlas-case__intro">
        <h1 id="atlas-proof-title">{ATLAS_INTRO.title}</h1>
        <p>{ATLAS_INTRO.body}</p>
      </section>

      <section id="atlas-proof-bento" className="atlas-proof-section">
        <div className="atlas-proof-grid" aria-label="Atlas interface board">
          <AtlasVisualTile
            id="atlas-triage-map"
            label="Atlas incident command interface"
            className="atlas-proof-tile--command"
          >
            <AtlasIncidentCommandScene />
          </AtlasVisualTile>

          <AtlasVisualTile
            id="atlas-capacity-state"
            label="Atlas emergency room interface"
            className="atlas-proof-tile--er"
          >
            <AtlasEmergencyRoomScene />
          </AtlasVisualTile>

          <AtlasVisualTile
            id="atlas-patient-row"
            label="Atlas field responder interface"
            className="atlas-proof-tile--phone"
          >
            <AtlasResponderScene />
          </AtlasVisualTile>

          <AtlasVisualTile
            id="atlas-motion-rule"
            label="Atlas instruction interface"
            className="atlas-proof-tile--instruction"
          >
            <AtlasInstructionScene />
          </AtlasVisualTile>

          <AtlasVisualTile
            id="atlas-quick-actions"
            label="Atlas quick send interface"
            className="atlas-proof-tile--actions"
          >
            <AtlasQuickActionScene />
          </AtlasVisualTile>

          <AtlasVisualTile
            id="atlas-hospital-stack"
            label="Atlas hospital assignment interface"
            className="atlas-proof-tile--hospital"
          >
            <AtlasHospitalStackScene />
          </AtlasVisualTile>
        </div>
      </section>

      <ProjectCaseStudyEntry>
        <section className="atlas-meta-surface" aria-labelledby="atlas-meta-title">
          <div className="atlas-meta-surface__header">
            <span id="atlas-meta-title">profile</span>
            <span>role · constraint · decision · outcome</span>
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

        <section id="atlas-event-contract" className="detail-outline-section">
          <DetailOutlineHeading heading="system sketch" signal="none" />
          <AtlasCodeArtifact />
        </section>

        <section id="atlas-decision-log" className="detail-outline-section">
          <DetailOutlineHeading heading="decision log" signal="none" />
          <AtlasDecisionLog />
        </section>

        <section id="atlas-reflection" className="detail-outline-section">
          <DetailOutlineHeading heading="short reflection" signal="none" />
          <div className="detail-outline-list">
            {ATLAS_REFLECTION.map((line) => (
              <DetailOutlineRow key={line} body={line} signal="none" />
            ))}
          </div>
        </section>
      </ProjectCaseStudyEntry>
    </motion.article>
  );
}
