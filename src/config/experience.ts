
export type Experience = {
  title: string;
  company: string;
  location: string;
  date: string;
  description: string[];
};

export const experiences: Experience[] = [
  {
    title: "Software Developer Intern",
    company: "Google",
    location: "Bengaluru, India",
    date: "May 2023 - Present",
    description: [
      "Contributed to the development of Google's internal tools, improving efficiency by 40%.",
      "Collaborated with cross-functional teams to deliver high-quality software solutions.",
      "Implemented responsive design principles, ensuring compatibility across various devices and browsers.",
      "Participated in code reviews and provided constructive feedback to maintain code quality."
    ],
  },
  {
    title: "Full Stack Developer Intern",
    company: "TCS",
    location: "Mumbai, India",
    date: "Jan 2023 - Apr 2023",
    description: [
      "Developed and maintained frontend and backend components for client projects.",
      "Worked with React.js for frontend development and Node.js for backend services.",
      "Collaborated with designers to implement responsive and intuitive user interfaces.",
      "Improved application performance by optimizing database queries and frontend rendering."
    ],
  },
  {
    title: "Web Development Intern",
    company: "Startup India",
    location: "Remote",
    date: "Jun 2022 - Dec 2022",
    description: [
      "Built responsive and accessible web applications for various clients.",
      "Integrated third-party APIs to enhance application functionality.",
      "Implemented user authentication and authorization using JWT.",
      "Participated in agile development processes, including daily stand-ups and sprint planning."
    ],
  },
];
