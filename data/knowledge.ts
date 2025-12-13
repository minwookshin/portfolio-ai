export const portfolioKnowledge = {
  personal: {
    name: "Minwook Shin",
    title: "UX Engineer",
    tagline: "0 to 1 Builder",
    description: "Design + Engineering + Business Strategy",
    bio: "I am a UX Engineer who doesn't just design interfaces but builds living products. My diverse journey studying Medicine, playing competitive Volleyball, writing lines of codes, and majoring in UX Design has shaped my unique approach to problem-solving. Medicine taught me empathy and scientific rigor in user research. Volleyball instilled the discipline of teamwork and rapid decision-making. Engineering gave me the power to turn those insights into functional code (React, Next.js, Unity).",
    location: "United States",
    visaStatus: "F-1 Visa (OPT Eligible)",
    availability: "Available for immediate start • Open to full-time opportunities"
  },

  contact: {
    email: "minwook@example.com",
    linkedin: "https://www.linkedin.com/in/minwookshin/",
    github: "https://github.com/YeYen1721"
  },

  skills: {
    design: ["Figma", "UI/UX Design", "Product Design", "Prototyping", "User Research"],
    engineering: ["Next.js", "React", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS"],
    ai: ["AI Integration", "LLM Applications", "Prompt Engineering"],
    tools: ["Git", "Framer Motion", "Responsive Design"]
  },

  topSkills: [
    { name: "Next.js", category: "Engineering", icon: "⚛️" },
    { name: "Figma", category: "Design", icon: "🎨" },
    { name: "AI Integration", category: "AI/ML", icon: "🤖" }
  ],

  projects: [
    {
      id: "flux",
      name: "FLUX Website",
      description: "Interactive design project with unique UI interactions",
      year: "2023",
      role: "Design & Development",
      themeColor: "#8B5CF6",
      technologies: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
      highlights: [
        "Grid-based layout with circular interactive elements",
        "Smooth animations and transitions for enhanced user experience",
        "Responsive design that adapts to different screen sizes"
      ],
      link: "http://www.minwookshin.com/project.html?project=flux",
      summary: "A creative web project showcasing innovative UI/UX design through an interactive grid-based layout with smooth animations and unique circular navigation system."
    },
    {
      id: "sentinel",
      name: "Sentinel",
      description: "Predictive Home Maintenance iOS App",
      year: "2025",
      role: "UX Engineer (Design + Native iOS Development)",
      themeColor: "#F59E0B",
      technologies: ["Swift", "SwiftUI", "Figma", "Predictive Data"],
      highlights: [
        "Built fully functional native iOS app in 48 hours",
        "Won 1st Place at Google x SCAD FLUX Hackathon 2025",
        "Implemented predictive risk scoring algorithm using historical weather data",
        "Designed and coded complete UX from scratch in Figma and Swift"
      ],
      link: "https://github.com/YeYen1721/sentinel",
      summary: "A predictive home maintenance iOS app that transforms home care from reactive crisis management to proactive risk mitigation. Winner of Google x SCAD FLUX Hackathon 2025, built in 48 hours from idea to fully functional native iOS MVP."
    },
    {
      id: "mindline",
      name: "Mindline",
      description: "AI-Powered Gambling Addiction Recovery Tool",
      year: "2025",
      role: "Lead Product Designer / UX Researcher",
      themeColor: "#3B82F6",
      technologies: ["AI Chatbot", "Real-time Intervention", "Gamification", "UX Research"],
      highlights: [
        "Real-time AI intervention that analyzes emotional states",
        "Smart journaling to identify behavioral patterns",
        "15-minute pause timer to disrupt impulsive dopamine loops",
        "Validated through user testing with target demographic (males 18-26)"
      ],
      link: "https://github.com/YeYen1721/mindline",
      summary: "An AI-powered support system that helps young adults overcome betting addiction through real-time emotional analysis, smart journaling, and behavioral interventions. Shifts focus from 'restriction' to 'awareness' for sustainable behavioral change."
    }
  ],

  experience: [
    {
      role: "Designer & Developer",
      period: "2023 - Present",
      description: "Building 0 to 1 products with focus on design and engineering excellence"
    }
  ],

  education: [
    {
      field: "Computer Science",
      focus: "Software Engineering & Design"
    },
    {
      field: "Medical Studies",
      focus: "Understanding human needs from scientific perspective"
    }
  ],

  philosophy: {
    approach: "0 to 1 Builder",
    strengths: [
      "Full-stack designer with engineering background",
      "Proven track record in 0-1 product development",
      "Strong in user research, prototyping, and implementation",
      "Experience bridging design and technical teams"
    ],
    uniquePerspective: "Each experience—from medical studies to competitive volleyball to computer science—has shaped how I approach design and problem-solving."
  }
};

export type PortfolioKnowledge = typeof portfolioKnowledge;
