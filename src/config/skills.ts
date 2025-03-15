
export type SkillCategory = {
  category: string;
  skills: string[];
};

export const skills: SkillCategory[] = [
  {
    category: "Frontend",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Redux"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "Python", "Django", "REST API", "GraphQL"],
  },
  {
    category: "Database",
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Firebase"],
  },
  {
    category: "DevOps & Tools",
    skills: ["Git", "GitHub", "Docker", "CI/CD", "AWS", "Vercel", "Netlify"],
  },
];
