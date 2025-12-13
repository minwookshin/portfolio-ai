export const portfolioData = {
  name: "Minwook Shin",
  title: "Designer & Developer",
  tagline: "0 to 1 Builder",
  bio: "More than a UI/UX designer, I'm a problem solver shaped by a diverse journey. My background includes medical studies, competitive volleyball, and computer science. Each experience has given me a unique perspective on design—understanding human needs from a scientific lens, teamwork from the court, and structured problem-solving from coding.",

  contact: {
    email: "mwshin0703@gmail.com",
    linkedin: "https://www.linkedin.com/in/minwookshin",
    github: "https://github.com/YeYen1721",
  },

  skills: [
    "UI/UX Design",
    "HTML/CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Figma",
    "Product Design",
    "Branding",
    "Design Systems"
  ],

  experience: [
    {
      role: "Designer & Developer",
      period: "2023 - Present",
      description: "Building innovative web experiences that blend design and code"
    }
  ],

  projects: [
    {
      name: "FLUX Website",
      description: "Interactive design project with unique UI interactions featuring an innovative grid-based layout with circular elements and dynamic interactions.",
      role: "Design & Development",
      year: "2023",
      technologies: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
      highlights: [
        "Grid-based layout with circular interactive elements",
        "Smooth animations and transitions",
        "Creative navigation system with directional indicators"
      ]
    },
    {
      name: "Telfair Museum",
      description: "Museum website with elegant design and user experience, showcasing art collections with a focus on elegant design and intuitive navigation.",
      role: "Design & Development",
      year: "2023",
      technologies: ["HTML", "CSS", "JavaScript", "Figma"],
      highlights: [
        "Clean, elegant interface design",
        "Accessible design following WCAG guidelines",
        "Responsive layout optimized for all devices"
      ]
    },
    {
      name: "Google Nest",
      description: "Product showcase with modern design principles demonstrating clean, modern UI/UX design.",
      role: "Design & Development",
      year: "2023",
      technologies: ["HTML", "CSS", "JavaScript", "Product Design"],
      highlights: [
        "Modern interface following Material Design principles",
        "Interactive product demonstrations",
        "Premium product showcase experience"
      ]
    },
    {
      name: "Name Me",
      description: "Creative naming project with interactive elements focused on branding and naming exploration.",
      role: "Design & Development",
      year: "2023",
      technologies: ["HTML", "CSS", "JavaScript", "Branding"],
      highlights: [
        "Interactive naming generation",
        "Unique UI elements",
        "Playful yet professional design"
      ]
    }
  ],

  education: [
    {
      field: "Medical Studies",
      description: "Understanding human needs from a scientific lens"
    },
    {
      field: "Computer Science",
      description: "Structured problem-solving through coding"
    }
  ],

  interests: [
    "Competitive Volleyball - Learning teamwork and strategy",
    "Design Systems - Creating scalable, reusable components",
    "Web Development - Building interactive experiences"
  ]
};

export type PortfolioData = typeof portfolioData;
