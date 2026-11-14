
export const defaultSkills = [
  { id: 1, name: "React", icon: "⚛️", color: "#61DAFB" },
  { id: 2, name: "Next.js", icon: "▲", color: "#ffffff" },
  { id: 3, name: "Node.js", icon: "🟢", color: "#8CC84B" },
  { id: 4, name: "MongoDB", icon: "🍃", color: "#47A248" },
];

export const defaultProjects = [
  {
    id: 1,
    title: "NovaCommerce",
    description: "Headless commerce platform with real-time inventory",
    tech: ["Next.js", "Stripe", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: 2,
    title: "PulseChat AI",
    description: "Real-time chat app with GPT-powered summaries",
    tech: ["React", "Node.js", "WebRTC"],
    github: "https://github.com",
    demo: "https://example.com",
  },
];

export const defaultMessages = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Project Inquiry",
    message: "I would like to discuss a project with you.",
    date: new Date().toISOString(),
    read: false,
  },
];

export const defaultAdmin = {
  email: "admin@portfolio.com",
  password: "admin123",
};