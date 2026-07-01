import type { CaseStudyData, DetailSection } from "@/components/detail/CaseStudy";
import type { Project } from "@/components/ProjectCard";

// Structured case studies. A project keyed here renders through the new
// data-driven CaseStudy system; projects without an entry keep the legacy
// rendering until they're migrated.
export const CASE_STUDIES: Record<string, CaseStudyData> = {
  // Atlas
  "11": {
    sections: [
      {
        kind: "hero",
        badge: "Team Atlas capstone - digital prototype system",
        title: "Atlas",
        subtitle:
          "A connected triage prototype system spanning first-responder mobile, incident-command iPad, ER intake, and the local server that kept patient state moving across the demo.",
        bullets: [
          "My scope: early structure, monochrome interface pass, native app prototypes, and real-time system behavior",
          "Team scope: final visual language, research narrative, service concept, and physical prototype",
          "Prototype proof: three app surfaces connected through a TypeScript/WebSocket triage server",
        ],
        tags: ["SwiftUI", "TypeScript", "WebSocket", "Mapbox", "Prototype Systems"],
        image: "/projects/atlas/ic-quick-send-photo.png",
        imageStyle: "cover",
      },
      {
        kind: "lead",
        eyebrow: "My contribution",
        heading: "A portfolio page about the working prototype, not the whole design story",
        body:
          "Atlas was a team capstone. I helped shape the first structural pass and a monochrome interface iteration, then focused on building the digital prototype system: the app surfaces, shared state, mock incident data, and live sync needed to make the concept demonstrable.",
        ask: ["What did you build?", "What was team-owned?"],
      },
      {
        kind: "stats",
        eyebrow: "Prototype proof",
        heading: "A working system, not a static case-study deck",
        items: [
          { value: "3", label: "Native app targets" },
          { value: "134", label: "Swift files" },
          { value: "7.1k", label: "Server code lines" },
          { value: "207", label: "Server tests passed" },
        ],
      },
      {
        kind: "artifact",
        eyebrow: "System artifact",
        heading: "The demo needed one source of truth",
        title: "Prototype event contract",
        meta: "architecture sketch",
        rows: [
          {
            label: "State",
            value: "patients / responders / hospitals / assignments",
            note: "The demo depended on a shared incident model instead of disconnected screen states.",
          },
          {
            label: "Transport",
            value: "REST setup + WebSocket updates",
            note: "Initial scenario data could be seeded, then changes moved live between role-specific clients.",
          },
          {
            label: "Clients",
            value: "FR mobile / IC iPad / ER intake",
            note: "Each surface stayed role-specific while reading from the same patient-state vocabulary.",
          },
        ],
        code: [
          "type TriageEvent =",
          "  | { type: 'patient.updated'; patientId: string; patch: PatientPatch }",
          "  | { type: 'patient.assigned'; patientId: string; hospitalId: string }",
          "  | { type: 'capacity.changed'; hospitalId: string; availableBeds: number };",
          "",
          "server.broadcast(event);",
        ].join("\n"),
        caption:
          "This is a case-study sketch of the prototype contract, not a pasted source excerpt. It explains the system shape behind the Atlas demo.",
      },
      {
        kind: "split",
        eyebrow: "Build scope",
        heading: "Four pieces made the prototype feel alive",
        columns: [
          {
            label: "FR mobile",
            title: "Responder-facing updates",
            body:
              "A mobile surface for map context, patient lists, injury updates, and quick triage changes from the field.",
          },
          {
            label: "IC iPad",
            title: "Command and assignment",
            body:
              "An incident-command surface for the operating map, patient assignment, quick-send instructions, and hospital capacity.",
          },
          {
            label: "ER iPad",
            title: "Receiving preparation",
            body:
              "A hospital intake surface showing incoming patients, live vitals, injury locations, and status history.",
          },
          {
            label: "Local server",
            title: "Shared patient state",
            body:
              "A TypeScript REST/WebSocket server handled mock incident data and broadcast patient updates across the app surfaces.",
          },
        ],
        ask: ["How did sync work?"],
      },
      {
        kind: "gallery",
        eyebrow: "Prototype surfaces",
        heading: "The three role-specific surfaces I helped connect",
        layout: "featured",
        images: [
          { src: "/projects/atlas/fr-map-photo.png", caption: "First-responder mobile map and patient context" },
          { src: "/projects/atlas/ic-quick-send-photo.png", caption: "Incident-command quick-send and map coordination" },
          { src: "/projects/atlas/er-patient-data-photo.png", caption: "Emergency receiving intake detail and patient status" },
        ],
      },
      {
        kind: "gallery",
        eyebrow: "Interface proof",
        heading: "Operational views from the connected prototype",
        images: [
          { src: "/projects/atlas/ic-map.png", caption: "Incident command map and operating context" },
          { src: "/projects/atlas/ic-patient-detail.png", caption: "Patient detail state in the command surface" },
          { src: "/projects/atlas/er-queue.png", caption: "Receiving queue and hospital intake preparation" },
          { src: "/projects/atlas/fr-patient-update.png", caption: "Responder update flow on mobile" },
        ],
      },
      {
        kind: "flow",
        eyebrow: "System flow",
        heading: "The prototype was built around a single shared incident state",
        steps: [
          {
            tag: "Mock incident",
            title: "Seed a live scenario",
            body:
              "A local data layer could generate a 47-patient incident stream so the demo had enough movement to stress the experience.",
          },
          {
            tag: "Server state",
            title: "Centralize patient, responder, and hospital updates",
            body:
              "The TypeScript server kept one source of truth for patient status, locations, assignments, teams, and instructions.",
          },
          {
            tag: "WebSocket broadcast",
            title: "Push changes to every surface",
            body:
              "When a patient changed, the server broadcast state events so FR, IC, and ER screens could stay synchronized.",
          },
          {
            tag: "Native clients",
            title: "Render role-specific views",
            body:
              "Each SwiftUI target used the same shared models while showing only the slice of the incident that role needed.",
          },
        ],
        note:
          "The final visual direction came from Team Atlas. My implementation work translated that direction into prototype apps, shared components, and live system behavior.",
      },
      {
        kind: "outcome",
        badge: "Credit boundary",
        heading: "What this page should claim",
        body: [
          "Atlas should be read as a team capstone where my strongest contribution was making the digital prototype work across multiple app surfaces.",
          "I am not claiming ownership of the final visual design or physical prototype. This page focuses on the structure, early monochrome pass, native prototypes, and real-time system I helped build.",
        ],
      },
    ],
    ask: ["Show the system flow", "What did you code?", "What was team-owned?"],
  },

  // Sentinel
  "1": {
    sections: [
      {
        kind: "hero",
        badge: "Winner / Google x SCAD FLUX 2025",
        title: "Sentinel",
        subtitle: "A native iOS MVP that turns weather risk into one next action.",
        bullets: [
          "Design engineer",
          "Native iOS prototype",
          "48-hour build",
        ],
        tags: ["SwiftUI", "iOS", "Climate Risk"],
        image: "/projects/sentinel/main.png",
        imageStyle: "phone",
      },
      {
        kind: "stats",
        eyebrow: "Proof",
        heading: "Built fast, shipped real",
        items: [
          { value: "48h", label: "Hackathon build" },
          { value: "SwiftUI", label: "Native MVP" },
          { value: "1st", label: "Place" },
        ],
      },
      {
        kind: "split",
        eyebrow: "What mattered",
        heading: "Priority over dashboard",
        columns: [
          {
            label: "Role",
            title: "Designed and built",
            body: "I took the product from structure to SwiftUI in one sprint.",
          },
          {
            label: "Decision",
            title: "One next action",
            body: "The app tells homeowners what needs attention now.",
          },
          {
            label: "Result",
            title: "A public MVP",
            body: "Demo, source, and post make the sprint verifiable.",
          },
        ],
      },
      {
        kind: "gallery",
        eyebrow: "Screens",
        heading: "Risk, alerts, actions",
        images: [
          { src: "/projects/sentinel/historical-timeline.png", caption: "Historical risk timeline" },
          { src: "/projects/sentinel/weather-alerts.png", caption: "Weather alerts" },
          { src: "/projects/sentinel/recommended-actions.png", caption: "Recommended actions" },
        ],
      },
      {
        kind: "outcome",
        badge: "Outcome",
        heading: "Outcome",
        body: [
          "Sentinel is a shipped log: native prototype, clear loop, public proof.",
          "Next: make the risk model inspectable without turning the app into analytics software.",
        ],
      },
    ],
    ask: ["What did 48 hours teach you?", "What would you add next?"],
  },

  // Portfolio AI, text/metric-driven. This site is its own live studio demo:
  // an AI-native website that explains the work, qualifies intent, and routes
  // visitors to the right proof.
  "2": {
    sections: [
      {
        kind: "hero",
        badge: "AI website + agent system",
        title: "Portfolio AI",
        subtitle: "A portfolio that answers questions, routes intent, and opens proof.",
        bullets: [
          "Design engineer",
          "AI as utility layer",
          "Live site and public repo",
        ],
        tags: ["Next.js", "React", "TypeScript", "AI UX"],
        hideMedia: true,
      },
      {
        kind: "stats",
        eyebrow: "Proof",
        heading: "The website is the prototype",
        items: [
          { value: "Live", label: "Production site" },
          { value: "Public repo", label: "Source" },
          { value: "Docs", label: "AI-readable routes" },
        ],
      },
      {
        kind: "lead",
        eyebrow: "Position",
        heading: "AI should move the visitor, not perform for them",
        body: "The assistant is a command utility: ask, route, copy, open proof.",
      },
      {
        kind: "split",
        eyebrow: "System",
        heading: "Small OS, not chatbot decoration",
        columns: [
          {
            label: "Command",
            title: "Search, ask, route",
            body: "Command-K gives the site a compact control layer.",
          },
          {
            label: "Proof",
            title: "Readable by people and models",
            body: "Work, resume data, tokens, and markdown stay open as routes.",
          },
        ],
      },
      {
        kind: "artifact",
        eyebrow: "Contract",
        heading: "The AI layer is bounded",
        title: "Portfolio command",
        meta: "system sketch",
        code: [
          "type PortfolioCommand =",
          "  | { intent: 'view.work'; target: ProjectSlug }",
          "  | { intent: 'copy.email' }",
          "  | { intent: 'ask.portfolio'; query: string };",
        ].join("\n"),
        caption: "A sketch of the interaction contract behind the command surface.",
      },
      {
        kind: "links",
        items: [
          { label: "Design system proof", href: "/design-system" },
          { label: "Design system markdown", href: "/design-system.md" },
          { label: "Design tokens JSON", href: "/design-system/tokens.json" },
        ],
      },
      {
        kind: "outcome",
        badge: "Outcome",
        heading: "A portfolio that behaves like software",
        body: [
          "Portfolio AI is a live system: quiet UI, command layer, public proof, bounded AI.",
        ],
      },
    ],
    ask: ["How does the command layer work?", "How do you keep AI bounded?"],
  },

  // Mindline
  "3": {
    sections: [
      {
        kind: "hero",
        badge: "Product design / UX research",
        title: "Mindline",
        subtitle: "A behavioral AI concept for awareness before restriction.",
        bullets: [
          "Product designer and UX researcher",
          "6 interviews",
          "Concept prototype",
        ],
        tags: ["AI UX", "Product Thinking", "Behavioral Design"],
        image: "/projects/mindline/log.png",
        imageStyle: "phone",
      },
      {
        kind: "flow",
        eyebrow: "Loop",
        heading: "Notice, reflect, intervene",
        steps: [
          { tag: "01", title: "Name the state", body: "The user logs the emotion before it becomes an action." },
          { tag: "02", title: "Find the pattern", body: "The system looks for repeated context: social pressure, stress, timing." },
          { tag: "03", title: "Offer one next step", body: "The product suggests a pause, reflection, or support action." },
        ],
        note: "Awareness first. Blocking is useful, but not the whole product.",
      },
      {
        kind: "gallery",
        eyebrow: "Screens",
        heading: "The concept in four surfaces",
        images: [
          { src: "/projects/mindline/suggestion.png", caption: "Personalized suggestion" },
          { src: "/projects/mindline/emotionalreflection.png", caption: "Emotional reflection" },
          { src: "/projects/mindline/insight.png", caption: "Pattern insight" },
          { src: "/projects/mindline/calendar.png", caption: "Progress calendar" },
        ],
      },
      {
        kind: "outcome",
        badge: "Reflection",
        heading: "Reasoning over polish",
        body: [
          "Mindline is product thinking: emotion, context, intervention timing.",
          "It stays honest about the boundary: concept, not clinical claim.",
        ],
      },
    ],
    ask: ["What did the research change?", "What would you build next?"],
  },

  // FLUX Website, concise snapshot (limited authored content for now)
  "4": {
    sections: [
      {
        kind: "hero",
        title: "FLUX Website",
        subtitle: "An event website built around grid navigation and small interactions.",
        bullets: [
          "Website Officer",
          "Vanilla HTML, CSS & JavaScript",
          "Responsive, animation-led UI",
        ],
        tags: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
        image: "/projects/1.png",
        imageStyle: "cover",
      },
      {
        kind: "links",
        items: [
          { label: "View live site", href: "https://www.scadflux.com" },
        ],
      },
      {
        kind: "lead",
        eyebrow: "Overview",
        heading: "Interaction-led, framework-free",
        body: "A framework-free event site with circular navigation, responsive grids, and light motion.",
        ask: ["Why vanilla JS over a framework?", "How did you do the animations?"],
      },
    ],
  },

  // CapExplorer
  "8": {
    sections: [
      {
        kind: "hero",
        title: "CapExplorer",
        subtitle: "A small product demo for exploring caps.",
        tags: ["Web", "UI/UX Design"],
      },
      {
        kind: "links",
        items: [
          { label: "LinkedIn", href: "https://www.linkedin.com/posts/minwookshin_buildinpublic-hat-ugcPost-7432477739208777729-sZlv/" },
        ],
      },
    ],
  },

  // Tomo
  "9": {
    sections: [
      {
        kind: "hero",
        title: "Tomo",
        subtitle: "A small interactive product demo.",
        tags: ["Product Design"],
      },
      {
        kind: "links",
        items: [
          { label: "LinkedIn", href: "https://www.linkedin.com/posts/minwookshin_technology-innovation-ugcPost-7432812004098084865-AGvW/" },
        ],
      },
    ],
  },

  // Caret
  "10": {
    sections: [
      {
        kind: "hero",
        title: "Caret",
        subtitle: "An iOS-style team wellbeing concept for burnout signals.",
        tags: ["Team Wellbeing", "iOS-style UX", "Web Prototype"],
      },
      {
        kind: "links",
        items: [
          { label: "GitHub", href: "https://github.com/minwookshin/caret" },
          { label: "LinkedIn", href: "https://www.linkedin.com/posts/minwookshin_nobody-quits-out-of-nowhere-they-burn-out-ugcPost-7432114646523740160-YWsz/" },
        ],
      },
    ],
  },
};

// Returns an authored case study, or synthesizes a lightweight "snapshot" from
// the project's own fields (title + one-liner + gallery). Some explorations are
// intentionally snapshots, not full case studies.
export function getCaseStudy(project: Project): CaseStudyData {
  const authored = CASE_STUDIES[project.id];
  if (authored) return authored;

  const gallery = project.gallery ?? (project.image ? [project.image] : []);
  const sections: DetailSection[] = [
    {
      kind: "hero",
      title: project.title,
      subtitle: project.fullDescription || project.overview || project.description,
      tags: project.tags,
    },
  ];
  if (gallery.length > 0) {
    sections.push({
      kind: "gallery",
      eyebrow: "The work",
      heading: "A closer look",
      images: gallery.map((src) => ({ src })),
    });
  }
  return { sections, ask: [`Tell me about ${project.title}`] };
}
