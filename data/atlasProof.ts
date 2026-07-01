export type AtlasMetaItem = {
  label: "role" | "constraint" | "decision" | "outcome";
  value: string;
};

export type AtlasImageItem = {
  src: string;
  alt: string;
  label: string;
};

export type AtlasDecisionItem = {
  label: string;
  value: string;
};

export const ATLAS_INTRO = {
  title: "atlas / 2026 / ai triage prototype system",
  body:
    "Atlas is a connected triage prototype for mass-casualty emergency response. I built the digital layer so field response, incident command, and ER intake could read the same patient state as working software.",
} as const;

export const ATLAS_META: AtlasMetaItem[] = [
  { label: "role", value: "interface system, prototype, interaction logic" },
  { label: "constraint", value: "emergency workflow, dense operational state" },
  { label: "decision", value: "scan speed over visual drama" },
  { label: "outcome", value: "working triage demo" },
];

export const ATLAS_TRIAGE_SEQUENCE: AtlasImageItem[] = [
  {
    src: "/projects/atlas/fr-map-photo.png",
    alt: "First responder map surface from the Atlas prototype",
    label: "field map",
  },
  {
    src: "/projects/atlas/ic-map.png",
    alt: "Incident command map from the Atlas prototype",
    label: "command map",
  },
  {
    src: "/projects/atlas/er-queue.png",
    alt: "ER queue surface from the Atlas prototype",
    label: "receiving queue",
  },
];

export const ATLAS_PATIENT_IMAGES: AtlasImageItem[] = [
  {
    src: "/projects/atlas/ic-patient-detail.png",
    alt: "Incident command patient detail surface",
    label: "command detail",
  },
  {
    src: "/projects/atlas/er-patient-data-photo.png",
    alt: "ER patient data surface from the Atlas prototype",
    label: "ER detail",
  },
];

export const ATLAS_EVENT_CONTRACT = [
  "type TriageEvent =",
  "  | { type: 'patient.updated'; patientId: string; patch: PatientPatch }",
  "  | { type: 'patient.assigned'; patientId: string; hospitalId: string }",
  "  | { type: 'capacity.changed'; hospitalId: string; availableBeds: number };",
  "",
  "server.broadcast(event);",
].join("\n");

export const ATLAS_DECISION_LOG: AtlasDecisionItem[] = [
  { label: "state model", value: "patients, responders, hospitals, assignments" },
  { label: "routing", value: "role-specific surfaces over one shared event stream" },
  { label: "motion", value: "confirm state changes without slowing emergency scanning" },
  { label: "boundary", value: "case-study sketch, not pasted production source" },
];

export const ATLAS_REFLECTION = [
  "The next version should make the system log inspectable.",
  "Every assignment, capacity change, and patient update should show why it moved.",
  "That would turn the demo from a believable flow into a stronger operational design tool.",
];
