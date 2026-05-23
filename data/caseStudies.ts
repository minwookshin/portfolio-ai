import type { CaseStudyData, DetailSection } from "@/components/detail/CaseStudy";
import type { Project } from "@/components/ProjectCard";

// Structured case studies. A project keyed here renders through the new
// data-driven CaseStudy system; projects without an entry keep the legacy
// rendering until they're migrated.
export const CASE_STUDIES: Record<string, CaseStudyData> = {
  // Sentinel
  "1": {
    sections: [
      {
        kind: "hero",
        badge: "Winner · Google × SCAD FLUX 2025",
        title: "Sentinel",
        subtitle: "Predictive home maintenance powered by climate-risk AI.",
        bullets: [
          "UX Engineer, design through code",
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
        kind: "video",
        eyebrow: "Demo",
        heading: "Sentinel in action",
        src: "/projects/sentinel/demo.mp4",
        aspect: "1280 / 826",
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

  // Portfolio AI, text/metric-driven (this site is its own live demo, so it
  // leans on its technical narrative and the real architecture diagram rather
  // than screenshots).
  "2": {
    sections: [
      {
        kind: "hero",
        badge: "Full-stack engineering",
        title: "Portfolio AI",
        subtitle: "A self-operating digital twin that turns a static résumé into a live technical interview.",
        bullets: [
          "Full-stack developer & designer",
          "Token-by-token streaming responses",
          "Server-side security architecture",
        ],
        tags: ["Next.js", "React", "Gemini API", "TypeScript"],
      },
      {
        kind: "lead",
        eyebrow: "The problem",
        heading: "Static portfolios create a bottleneck",
        body:
          "Recruiters need specific answers, 'How did you handle state?', 'Why Next.js?', but they're stuck skimming long case studies. Portfolio AI answers in natural language, in real time, grounded in my real work. You're using it right now.",
        ask: ["Why not just a PDF résumé?"],
      },
      {
        kind: "split",
        eyebrow: "How it's built",
        heading: "Engineered for conversational UX",
        columns: [
          {
            label: "Streaming via SSE",
            title: "Responses that feel alive",
            body:
              "Server-Sent Events stream the model's reply token-by-token, a natural conversational rhythm with no loading spinners.",
          },
          {
            label: "Defense in depth",
            title: "Server-side security",
            body:
              "API keys never touch the browser; requests route through Next.js API routes with rate limiting and environment isolation.",
          },
        ],
        ask: ["How does the streaming work?", "How do you keep the API key safe?"],
      },
      {
        kind: "stats",
        eyebrow: "Performance",
        heading: "The numbers",
        items: [
          { value: "<100ms", label: "Time to first token" },
          { value: "<200ms", label: "Global response time" },
          { value: "~35%", label: "Fewer tokens via prompt tuning" },
        ],
      },
      {
        kind: "gallery",
        eyebrow: "Under the hood",
        heading: "System architecture",
        images: [{ src: "/projects/portfolio-ai/architecture.png", caption: "Client → Next.js API route → Gemini, streamed back over SSE" }],
      },
      {
        kind: "outcome",
        badge: "Impact",
        heading: "Bridging design, engineering & product",
        body: [
          "Delivered a streaming AI chat interface with server-side security and sub-100ms first-token latency.",
          "Cut token usage ~35% through prompt optimization, and unified visual polish with technical rigor, full-stack ownership, end to end.",
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
          "AI UX Designer & UX Researcher",
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
          "Mindline shifts the paradigm from restriction to awareness. In testing with 6 participants, it reduced impulsive betting triggers by interrupting the dopamine loop before action occurs.",
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
          { label: "View live site", href: "https://www.scadflux.com/fluxathon" },
          { label: "GitHub", href: "https://github.com/YeYen1721/portfolio-" },
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
        kind: "video",
        eyebrow: "Demo",
        heading: "CapExplorer in action",
        src: "/projects/capexplorer/demo.mp4",
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
        kind: "video",
        eyebrow: "Demo",
        heading: "Tomo in action",
        src: "/projects/tomo/demo.mp4",
      },
    ],
  },

  // Caret
  "10": {
    sections: [
      {
        kind: "hero",
        title: "Caret",
        subtitle: "An iOS app and UX design project.",
        tags: ["iOS", "UX Design"],
      },
      {
        kind: "video",
        eyebrow: "Demo",
        heading: "Caret in action",
        src: "/projects/caret/demo.mp4",
      },
    ],
  },
};

// Returns an authored case study, or synthesizes a lightweight "snapshot" from
// the project's own fields (title + one-liner + gallery). Projects like Telfair,
// Nest and NameMe are intentionally snapshots, not full case studies.
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
