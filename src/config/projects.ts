
export type Project = {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with product listings, cart functionality, user authentication, and payment processing.",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    demoUrl: "https://ecommerce-demo.example.com",
    githubUrl: "https://github.com/username/ecommerce-platform",
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, task assignment, and progress tracking.",
    tags: ["Next.js", "Firebase", "Tailwind CSS", "React Query"],
    imageUrl: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",
    demoUrl: "https://task-app.example.com",
    githubUrl: "https://github.com/username/task-management",
  },
  {
    title: "AI-Powered Content Creator",
    description: "An application that leverages AI to generate content for various platforms, with customization options and export capabilities.",
    tags: ["React", "Python", "OpenAI API", "Flask", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1677442135743-1c70eb68026a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
    demoUrl: "https://ai-content.example.com",
    githubUrl: "https://github.com/username/ai-content-creator",
  },
  {
    title: "Fitness Tracking Dashboard",
    description: "A comprehensive fitness tracking application with workout plans, progress visualization, and nutritional guidance.",
    tags: ["TypeScript", "React", "Chart.js", "Node.js", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    demoUrl: "https://fitness-dashboard.example.com",
    githubUrl: "https://github.com/username/fitness-tracker",
  },
];
