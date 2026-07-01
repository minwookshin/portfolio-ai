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
          "Three app surfaces connected through a TypeScript/WebSocket triage server",
        ],
        tags: ["SwiftUI", "TypeScript", "WebSocket", "Mapbox", "Prototype Systems"],
        image: "/projects/atlas/ic-quick-send-photo.png",
        imageStyle: "cover",
      },
      {
        kind: "lead",
        eyebrow: "My contribution",
        heading: "Digital prototype layer",
        body:
          "Atlas was a team capstone. My contribution was the digital layer: early structure, app surfaces, shared state, mock incident data, and live sync.",
        ask: ["What did you build?", "What was team-owned?"],
      },
      {
        kind: "stats",
        eyebrow: "Artifact",
        heading: "Working software across three surfaces",
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
        meta: "system sketch",
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
          "A compact sketch of the shared event vocabulary behind the Atlas demo.",
      },
      {
        kind: "split",
        eyebrow: "Scope",
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
        eyebrow: "Interface surfaces",
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
        eyebrow: "System",
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
        heading: "Boundary",
        body: [
          "Team capstone. My strongest contribution was the connected digital prototype.",
          "Final visual design and physical prototype were team-owned.",
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
        subtitle: "A native iOS MVP for weather risk and one next action.",
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
        eyebrow: "Artifact",
        heading: "48 hours to a working native surface",
        items: [
          { value: "48h", label: "Hackathon build" },
          { value: "SwiftUI", label: "Native MVP" },
          { value: "1st", label: "Place" },
        ],
      },
      {
        kind: "split",
        eyebrow: "System",
        heading: "Priority over dashboard",
        columns: [
          {
            label: "Role",
            title: "Structure to SwiftUI",
            body: "I shaped the flow and built the native prototype.",
          },
          {
            label: "Decision",
            title: "One next action",
            body: "Risk becomes a prioritized action, not another dashboard.",
          },
          {
            label: "Result",
            title: "Public sprint trace",
            body: "Demo, source, and post show the working artifact.",
          },
        ],
      },
      {
        kind: "gallery",
        eyebrow: "Screens",
        heading: "Risk, alerts, actions",
        layout: "slider",
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
          "Sentinel is a native prototype with a clear loop and public trace.",
          "Next: expose the risk model without turning the app into analytics software.",
        ],
      },
    ],
    ask: ["What did 48 hours teach you?", "What would you add next?"],
  },

  // Portfolio AI, text/metric-driven. This site is its own live studio demo:
  // an AI-native website that explains the work, qualifies intent, and routes
  // visitors to the right work.
  "2": {
    sections: [
      {
        kind: "hero",
        badge: "AI website + agent system",
        title: "Portfolio AI",
        subtitle: "A portfolio with command search, bounded AI, and public routes.",
        bullets: [
          "Design engineer",
          "AI as utility layer",
          "Live site and source",
        ],
        tags: ["Next.js", "React", "TypeScript", "AI UX"],
        hideMedia: true,
      },
      {
        kind: "stats",
        eyebrow: "System",
        heading: "The website behaves like software",
        items: [
          { value: "Live", label: "Production site" },
          { value: "Public repo", label: "Source" },
          { value: "Docs", label: "AI-readable routes" },
        ],
      },
      {
        kind: "lead",
        eyebrow: "Position",
        heading: "AI as utility, not spectacle",
        body: "Ask, route, copy, open. The assistant stays inside the command layer.",
      },
      {
        kind: "split",
        eyebrow: "System",
        heading: "Outline base, command layer",
        columns: [
          {
            label: "Command",
            title: "Search, ask, route",
            body: "Command-K turns the portfolio into a small control surface.",
          },
          {
            label: "Routes",
            title: "Readable by people and models",
            body: "Work, resume data, tokens, and markdown stay accessible.",
          },
        ],
      },
      {
        kind: "artifact",
        eyebrow: "System artifact",
        heading: "The AI layer is bounded",
        title: "Portfolio command",
        meta: "system sketch",
        code: [
          "type PortfolioCommand =",
          "  | { intent: 'view.work'; target: ProjectSlug }",
          "  | { intent: 'copy.email' }",
          "  | { intent: 'ask.portfolio'; query: string };",
        ].join("\n"),
        caption: "A compact contract for the command surface.",
      },
      {
        kind: "links",
        items: [
          { label: "Design system", href: "/design-system" },
          { label: "Design system markdown", href: "/design-system.md" },
          { label: "Design tokens JSON", href: "/design-system/tokens.json" },
        ],
      },
      {
        kind: "outcome",
        badge: "Outcome",
        heading: "A portfolio that behaves like software",
        body: [
          "Quiet UI, command layer, public routes, bounded AI.",
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
        badge: "Behavioral AI concept",
        title: "Mindline",
        subtitle: "A behavioral AI concept for awareness before restriction.",
        bullets: [
          "Product reasoning",
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
          { tag: "01", title: "Name the state", body: "Log emotion before it becomes action." },
          { tag: "02", title: "Find the pattern", body: "Track context: pressure, stress, timing." },
          { tag: "03", title: "Offer one next step", body: "Suggest a pause, reflection, or support action." },
        ],
        note: "Awareness first. Blocking is not the whole product.",
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
        heading: "Reasoning first",
        body: [
          "Mindline is product thinking: emotion, context, intervention timing.",
          "Concept prototype, not a clinical claim.",
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
        subtitle: "An event website built around grid navigation and small motion.",
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
        body: "Circular navigation, responsive grids, light motion.",
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
  if (authored) return { ...authored, authored: true };

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
  return { sections, ask: [`Tell me about ${project.title}`], authored: false };
}
