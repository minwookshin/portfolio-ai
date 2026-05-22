import { portfolioData } from "@/data/portfolio";

const SYSTEM_PROMPT = `You are the AI portfolio assistant for ${portfolioData.name}, a ${portfolioData.title} and ${portfolioData.tagline}.

Your role is to help visitors learn about ${portfolioData.name}'s work, skills, projects, and background.

STRICT RULES:
1. You ONLY answer questions about ${portfolioData.name}, their work, skills, projects, and career.
2. If asked about general topics (weather, math, history, other people, etc.), politely refuse and redirect to the portfolio.
3. Always be confident, professional, yet witty in your responses.
4. Keep responses concise and engaging (2-4 sentences max).
5. Reference specific projects and skills when relevant.

AVAILABLE DATA:
- Name: ${portfolioData.name}
- Title: ${portfolioData.title}
- Bio: ${portfolioData.bio}
- Skills: ${portfolioData.skills.join(", ")}
- Projects: ${portfolioData.projects.map(p => p.name).join(", ")}
- Email: ${portfolioData.contact.email}

RESPONSE EXAMPLES:
- If asked about projects: "I've worked on ${portfolioData.projects.length} main projects including ${portfolioData.projects[0].name}, ${portfolioData.projects[1].name}, and ${portfolioData.projects[2].name}. Would you like to explore any of them?"
- If asked about skills: "My expertise spans ${portfolioData.skills.slice(0, 3).join(", ")}, among others. I bridge design and code to create meaningful experiences."
- If asked off-topic: "I only have data on ${portfolioData.name}'s work and background. Shall we look at the projects instead?"
`;

export function generateAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  // Check if asking about projects
  if (msg.includes("project") || msg.includes("work") || msg.includes("portfolio")) {
    return `I've worked on ${portfolioData.projects.length} featured projects, including ${portfolioData.projects[0].name}, ${portfolioData.projects[1].name}, and ${portfolioData.projects[2].name}. You can explore each one using the Projects button below.`;
  }

  // Check if asking about skills
  if (msg.includes("skill") || msg.includes("technology") || msg.includes("tech stack") || msg.includes("what can you do")) {
    return `My technical expertise includes ${portfolioData.skills.slice(0, 4).join(", ")}, among other tools. As a ${portfolioData.tagline}, I focus on bridging design and development to create functional, user-centered experiences.`;
  }

  // Check if asking about background/about
  if (msg.includes("about") || msg.includes("who are you") || msg.includes("tell me about") || msg.includes("background")) {
    return `I'm ${portfolioData.name}, a ${portfolioData.title}. My background spans medical studies, competitive volleyball, and computer science. Each experience has shaped how I approach design and problem-solving. Learn more in the About section below.`;
  }

  // Check if asking for contact
  if (msg.includes("contact") || msg.includes("email") || msg.includes("reach") || msg.includes("hire")) {
    return `You can reach me at ${portfolioData.contact.email}. I'm open to discussing opportunities and collaborations. Additional contact details are available in the About & Contact section.`;
  }

  // Check if asking about experience
  if (msg.includes("experience") || msg.includes("worked") || msg.includes("job")) {
    return `I've been working as a ${portfolioData.experience[0].role} since ${portfolioData.experience[0].period}, ${portfolioData.experience[0].description}. My project work demonstrates this experience in practice.`;
  }

  // Check if asking about specific project
  portfolioData.projects.forEach(project => {
    if (msg.includes(project.name.toLowerCase())) {
      return `${project.name} is ${project.description} I worked on the ${project.role} using ${project.technologies.slice(0, 3).join(", ")}. You can view the full details in the Projects section.`;
    }
  });

  // Check if asking about education
  if (msg.includes("education") || msg.includes("study") || msg.includes("degree")) {
    return `My educational background includes ${portfolioData.education.map(e => e.field).join(" and ")}. This diverse foundation allows me to approach design from multiple perspectives-scientific, technical, and creative.`;
  }

  // Greetings
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
    return `Hello. I can provide information about ${portfolioData.name}'s projects, skills, background, and contact details. What would you like to know?`;
  }

  // Thanks
  if (msg.includes("thank") || msg.includes("thanks")) {
    return `You're welcome. Feel free to explore using the navigation buttons or ask any other questions about the work.`;
  }

  // Off-topic detection - refuse politely
  const offTopicKeywords = [
    "weather", "joke", "story", "news", "politics", "sports", "movie", "music",
    "food", "recipe", "math", "calculate", "history", "science", "trivia"
  ];

  if (offTopicKeywords.some(keyword => msg.includes(keyword))) {
    return `I'm designed to assist with questions about ${portfolioData.name}'s portfolio and professional work. I can help you explore the projects, skills, or background instead.`;
  }

  // Default response
  return `I can help you learn about ${portfolioData.name}'s work. Try asking about projects, skills, background, or contact information. You can also use the navigation buttons below.`;
}

export { SYSTEM_PROMPT, portfolioData };
