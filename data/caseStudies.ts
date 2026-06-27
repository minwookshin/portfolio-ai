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
        badge: "Winner · Google × SCAD FLUX 2025",
        title: "Sentinel",
        subtitle: "Predictive home maintenance powered by climate-risk AI.",
        bullets: [
          "Design Engineer — designed & built",
          "48-hour hackathon sprint",
          "Native iOS (Swift + SwiftUI)",
        ],
        tags: ["Swift", "SwiftUI", "Climate Data", "Predictive ML"],
        image: "/projects/sentinel/main.png",
        imageStyle: "phone",
      },
      {
        kind: "stats",
        eyebrow: "Recruiter proof",
        heading: "Built fast, shipped native, publicly verifiable",
        items: [
          { value: "48h", label: "Hackathon build" },
          { value: "SwiftUI", label: "Native iOS MVP" },
          { value: "Public repo", label: "Source-code proof" },
        ],
      },
      {
        kind: "problem",
        eyebrow: "The problem",
        heading: "Homeowners manage their biggest asset on gut feeling",
        body:
          "Climate volatility is the new normal, and invisible risks get ignored until they become $200,000 disasters. A $100 inspection skipped today becomes catastrophic failure tomorrow, reactive crisis management instead of prevention.",
        stats: [
          { value: "$200K+", label: "Storm damage ignored" },
          { value: "$100", label: "Basic inspection" },
        ],
        persona: {
          name: "Alex, 35",
          role: "Doctor · New homeowner",
          points: [
            "Moved into a 2010 home",
            "Worries about hidden storm damage",
            "Wants to stop guessing and start preventing",
          ],
        },
        ask: ["Who is Sentinel built for?", "How big is the risk really?"],
      },
      {
        kind: "split",
        eyebrow: "The build",
        heading: "From design to code, by one person",
        columns: [
          {
            label: "Designed in Figma",
            title: "Rapid visual prototyping",
            body:
              "Risk-visualization interfaces designed under extreme time constraints, clarity and emotional weight for high-stakes decisions.",
          },
          {
            label: "Engineered in Swift",
            title: "Native iOS implementation",
            body:
              "A vulnerability-scoring engine in Swift + SwiftUI, fed by historical weather data to compute predictive risk scores in real time.",
          },
        ],
        ask: ["Why native Swift over React Native?", "How do you go from Figma to code?"],
      },
      {
        kind: "features",
        eyebrow: "The work",
        heading: "Three pillars of predictive maintenance",
        items: [
          {
            title: "Historical risk timeline",
            description:
              "Visualize past weather events and their financial impact on the property, so risk feels concrete instead of abstract.",
            image: "/projects/sentinel/historical-timeline.png",
          },
          {
            title: "Weather alerts & forecasting",
            description:
              "Real-time alerts and climate forecasting to prepare for incoming storms and extreme-weather events before they hit.",
            image: "/projects/sentinel/weather-alerts.png",
          },
          {
            title: "Actionable maintenance tasks",
            description:
              "A prioritized checklist of preventive actions ranked by risk severity and urgency, guesswork replaced with a plan.",
            image: "/projects/sentinel/recommended-actions.png",
          },
        ],
        ask: ["How does the risk scoring work?"],
      },
      {
        kind: "outcome",
        badge: "Winner · 1st place",
        heading: "Outcome",
        body: [
          "Shipped a fully functional iOS MVP in a 48-hour sprint, validating predictive maintenance through real climate-data integration and user testing.",
          "Won 1st place at the Google × SCAD FLUX Hackathon 2025, proof that climate-risk analytics can be turned into a usable, native homeowner tool, fast.",
        ],
      },
    ],
    ask: ["What did 48 hours teach you?", "Why did you build this?", "What would you add next?"],
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
        subtitle: "An AI-native studio site that turns passive browsing into a live project briefing.",
        bullets: [
          "Design Engineer — designed & built solo",
          "Token-by-token streaming responses",
          "Project-intake flow wired to real case studies",
        ],
        tags: ["Next.js", "React", "Gemini API", "TypeScript", "AI UX"],
        hideMedia: true,
      },
      {
        kind: "stats",
        eyebrow: "Recruiter proof",
        heading: "A live portfolio, source repo, and AI-readable system",
        items: [
          { value: "Live", label: "Production site" },
          { value: "Public repo", label: "Source-code proof" },
          { value: "3", label: "AI-readable routes" },
        ],
      },
      {
        kind: "lead",
        eyebrow: "The problem",
        heading: "Static portfolios do not qualify intent",
        body:
          "Most portfolio sites make visitors do the work: skim thumbnails, guess relevance, and hunt for proof. Portfolio AI behaves more like a studio strategist, answering questions, identifying what someone wants to build, and opening the most relevant project evidence.",
        ask: ["Why make the site conversational?"],
      },
      {
        kind: "split",
        eyebrow: "Product proof",
        heading: "The site behaves like a small product system",
        columns: [
          {
            label: "Intake",
            title: "Conversation qualifies the visitor's intent",
            body:
              "Visitors can ask for an AI website, UX audit, product prototype, or case study. The response stays conversational, but it is backed by a clear intake path.",
          },
          {
            label: "Routing",
            title: "Project evidence opens deterministically",
            body:
              "The chat can route people to the right case study without exposing implementation details. It feels like a dialogue, while navigation remains predictable.",
          },
        ],
        ask: ["How does the intake flow work?", "How do you keep the API key safe?"],
      },
      {
        kind: "flow",
        eyebrow: "What it demonstrates",
        heading: "Taste, system thinking, and applied AI in one surface",
        steps: [
          {
            title: "Live AI interface",
            body: "Streaming responses, scoped system prompts, and guarded project routing are part of the actual portfolio experience.",
          },
          {
            title: "Evidence-first navigation",
            body: "The interface points recruiters and collaborators to concrete work instead of making the AI the whole product.",
          },
          {
            title: "Machine-readable system",
            body: "Portfolio content, resume data, LLM instructions, design tokens, and interaction rules are exposed as public routes.",
          },
        ],
      },
      {
        kind: "gallery",
        eyebrow: "Under the hood",
        heading: "System architecture",
        images: [{ src: "/projects/portfolio-ai/architecture.png", caption: "Client → Next.js API route → Gemini, streamed back over SSE" }],
      },
      {
        kind: "split",
        eyebrow: "System proof",
        heading: "AI-readable interface primitives, not just a page",
        columns: [
          {
            label: "Design tokens",
            title: "Roles instead of decoration",
            body:
              "Color, type, spacing, radius, and motion roles are documented so new UI can be generated from the same quiet system.",
          },
          {
            label: "Interaction contract",
            title: "Rules an LLM can follow",
            body:
              "Component primitives, accessibility rules, reduced-motion behavior, and AI usage limits are exposed as public docs.",
          },
        ],
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
        badge: "Impact",
        heading: "Turning a portfolio into an agency-style lead flow",
        body: [
          "Delivered a streaming AI interface that shows design taste, frontend craft, and applied AI in one live product.",
          "Reframed the portfolio as a working studio demo: visitors can explore the work, ask about capabilities, and start a project brief from the same surface.",
        ],
      },
    ],
    ask: ["What model runs this?", "How do you stop it hallucinating?", "What was the hardest part?"],
  },

  // Mindline
  "3": {
    sections: [
      {
        kind: "hero",
        badge: "Product Design · UX Research",
        title: "Mindline",
        subtitle: "Breaking the cycle, AI-powered intervention for betting addiction.",
        bullets: [
          "Product Designer & UX Researcher",
          "10-week research & design sprint",
          "Target: young adults, 18–26",
        ],
        tags: ["AI Chatbot", "Behavioral Psychology", "Real-time Intervention"],
        image: "/projects/mindline/log.png",
        imageStyle: "phone",
      },
      {
        kind: "problem",
        eyebrow: "The problem",
        heading: "A silent epidemic among young adults",
        body:
          "Young adults (18–26) face betting addiction fueled by mobile accessibility and aggressive marketing. The blocking tools meant to help are ineffective, users bypass them within minutes.",
        stats: [
          { value: "6", label: "In-depth interviews" },
          { value: "18–26", label: "Target age range" },
        ],
        ask: ["Why focus on awareness, not blocking?"],
      },
      {
        kind: "quote",
        text:
          "Social environments and peer pressure are the primary triggers for relapse. We need real-time intervention, not reactive restriction.",
        attribution: "Dr. Kristen Adams, Clinical Psychologist",
      },
      {
        kind: "features",
        eyebrow: "The solution",
        heading: "Three pillars of intervention",
        items: [
          {
            title: "Personalized AI suggestions",
            description:
              "When high-risk triggers surface, the AI offers contextual strategies, set a pause timer, mute bet triggers during social events, reflect on past patterns, tailored to the user's emotional state.",
            image: "/projects/mindline/suggestion.png",
          },
          {
            title: "Emotional reflection journaling",
            description:
              "After an urge or relapse, users document the emotional journey through guided reflection, building a history that feeds the AI's pattern recognition.",
            image: "/projects/mindline/emotionalreflection.png",
          },
          {
            title: "AI-powered pattern insights",
            description:
              "Machine learning surfaces recurring triggers, 'high-energy social settings', 'post-work stress', so users recognize warning signs before they escalate.",
            image: "/projects/mindline/insight.png",
          },
        ],
        ask: ["How does the AI detect triggers?"],
      },
      {
        kind: "flow",
        eyebrow: "How it works",
        heading: "Emotion → analysis → action",
        steps: [
          { tag: "User action", title: "Emotion input", body: "The user logs an emotional state, 'anxious' or 'excited', in the moment." },
          { tag: "Pattern recognition", title: "AI analysis", body: "The system cross-references past patterns and detects a high-risk signal like a social betting trigger." },
          { tag: "Real-time action", title: "Intervention", body: "It suggests a concrete step, activate a pause timer or reach a support line, before the impulse acts." },
        ],
        note:
          "Unlike blockers that users bypass within minutes, Mindline uses behavioral psychology and real-time pattern recognition to interrupt the dopamine loop before impulsive action occurs.",
        ask: ["What did the research uncover?"],
      },
      {
        kind: "gallery",
        eyebrow: "More of the product",
        heading: "Supporting tools",
        images: [
          { src: "/projects/mindline/ai.png", caption: "AI conversational support" },
          { src: "/projects/mindline/calendar.png", caption: "Progress calendar of emotional states" },
          { src: "/projects/mindline/shorts.png", caption: "Social context awareness with photo logging" },
          { src: "/projects/mindline/main.png", caption: "Supportive onboarding, 'bet on yourself'" },
        ],
      },
      {
        kind: "outcome",
        badge: "Project impact",
        heading: "Outcome & reflection",
        body: [
          "Mindline shifts the paradigm from restriction to awareness. 6 research interviews surfaced trigger patterns around emotional states, social pressure, and relapse timing.",
          "Rather than blocking access, which users bypass within minutes, it builds self-awareness, real-time emotional analysis, and proactive intervention: the foundation for sustainable behavioral change.",
        ],
      },
    ],
    ask: ["What was your exact role?", "How did you validate it?", "What would you change?"],
  },

  // FLUX Website, concise snapshot (limited authored content for now)
  "4": {
    sections: [
      {
        kind: "hero",
        title: "FLUX Website",
        subtitle: "An interactive event platform built around a grid-based layout and bespoke micro-interactions.",
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
        body:
          "FLUX is a creative web project showcasing innovative UI/UX through an interactive grid-based layout. Built without heavy frameworks, it leans on a unique circular navigation system, smooth animations, and responsive design to make browsing feel playful.",
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
        subtitle: "A website for exploring caps.",
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
        subtitle: "Interactive demo.",
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
        subtitle: "An iOS-style team wellbeing app concept exploring burnout signals, presented through a public web prototype.",
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
