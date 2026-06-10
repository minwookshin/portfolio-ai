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
        badge: "Capstone · AI triage system",
        title: "Atlas",
        subtitle: "A multi-surface triage communication system for mass-casualty response.",
        bullets: [
          "Design Engineer - product system and prototype",
          "First-responder, incident-command, and emergency-receiving surfaces",
          "Demo video intentionally pending phone-recorded walkthrough",
        ],
        tags: ["Figma", "SwiftUI", "TypeScript", "WebSocket", "AI Triage"],
        image: "/projects/atlas/ic-map.png",
        imageStyle: "cover",
      },
      {
        kind: "lead",
        eyebrow: "The problem",
        heading: "Emergency teams lose time when triage state is scattered",
        body:
          "During a mass-casualty response, patient status, location, priority, and hospital capacity can move faster than the communication layer. Atlas explores a calmer system where each team sees the slice of state they need without rebuilding context from scratch.",
        ask: ["What is Atlas?", "Who is it for?"],
      },
      {
        kind: "split",
        eyebrow: "The system",
        heading: "Three surfaces, one patient state",
        columns: [
          {
            label: "Field response",
            title: "Fast patient updates",
            body:
              "First responders can update triage status and patient details through a focused mobile flow built for speed, not documentation theater.",
          },
          {
            label: "Incident command",
            title: "Map-based coordination",
            body:
              "Incident command sees responders, patient markers, sector state, and hospital assignments in one spatial view.",
          },
          {
            label: "Emergency receiving",
            title: "Queue and capacity awareness",
            body:
              "Receiving teams can understand what is coming next before patients arrive, reducing surprise handoffs.",
          },
        ],
        ask: ["How does the system work?"],
      },
      {
        kind: "flow",
        eyebrow: "How it works",
        heading: "Triage data moves with the patient",
        steps: [
          {
            tag: "First responder",
            title: "Capture a patient update",
            body:
              "Responder-facing screens focus on the minimum useful state: triage priority, condition, location, and action-ready notes.",
          },
          {
            tag: "Incident command",
            title: "Coordinate from the map",
            body:
              "The command view turns those updates into a spatial operating picture, connecting patient markers, units, and receiving destinations.",
          },
          {
            tag: "Emergency receiving",
            title: "Prepare the intake queue",
            body:
              "The receiving view converts field state into an intake queue so hospital teams can prepare resources before arrival.",
          },
        ],
        note:
          "The current portfolio version shows product structure and interface proof. The polished demo walkthrough will be added after fresh phone footage is recorded.",
      },
      {
        kind: "stats",
        eyebrow: "Build proof",
        heading: "What is visible now",
        items: [
          { value: "3", label: "Primary surfaces" },
          { value: "5", label: "Published interface frames" },
          { value: "2026", label: "Capstone system" },
        ],
      },
      {
        kind: "gallery",
        eyebrow: "Interface system",
        heading: "Field, command, and receiving views",
        images: [
          { src: "/projects/atlas/fr-patient-update.png", caption: "First-responder patient update flow" },
          { src: "/projects/atlas/er-queue.png", caption: "Emergency receiving queue" },
          { src: "/projects/atlas/ic-patient-detail.png", caption: "Incident-command patient detail" },
          { src: "/projects/atlas/ic-quick-send.png", caption: "Incident-command quick send flow" },
        ],
      },
      {
        kind: "outcome",
        badge: "Current status",
        heading: "Prepared as a case-study draft",
        body: [
          "Atlas stays in the work archive as an in-progress capstone proof until the full case study is ready.",
          "The project is intentionally presented without a demo video until the next recorded walkthrough is ready.",
        ],
      },
    ],
    ask: ["What would you improve next?", "Show the system flow", "Why Atlas?"],
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
        eyebrow: "How it's built",
        heading: "Built like a product, not a chatbot wrapper",
        columns: [
          {
            label: "Conversational intake",
            title: "A website that can qualify a project",
            body:
              "Visitors can ask for an AI website, UX audit, product prototype, or case study. The system responds with a clear path and routes them to relevant proof.",
          },
          {
            label: "Proof system",
            title: "Case studies wired into the chat",
            body:
              "Hidden directives let the AI open the right project screen without exposing routing logic. The experience stays conversational, but the navigation is deterministic.",
          },
        ],
        ask: ["How does the intake flow work?", "How do you keep the API key safe?"],
      },
      {
        kind: "stats",
        eyebrow: "Studio proof",
        heading: "What this demonstrates",
        items: [
          { value: "8", label: "Work examples" },
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
        heading: "AI-readable interface primitives",
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
          { label: "design system proof", href: "/design-system" },
          { label: "design-system.md", href: "/design-system.md" },
          { label: "tokens.json", href: "/design-system/tokens.json" },
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
