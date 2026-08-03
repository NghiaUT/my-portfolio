import type { Project, ContactLink, SkillGroup } from "../types/index.type";

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C++"],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "JWT",
    ],
  },
  {
    category: "Frontend",
    items: ["React", "Vite", "TailwindCSS", "React Query"],
  },
  {
    category: "Practice",
    items: ["Git", "Scrum / Agile", "REST API design"],
  },
];

export const projects: Project[] = [
  {
    id: "fotobook",
    title: "Fotobook",
    role: "Full-stack Developer · Internship",
    description:
      "Photo-sharing platform built during an internship at NUS Technology, structured as a monorepo housing both backend and frontend.",
    highlights: [
      "Used Prisma transactions to keep photo uploads consistent and roll back cleanly on failure",
      "Fixed a race condition triggered by rapid consecutive uploads",
      "Offloaded email delivery and image processing to a Redis + BullMQ queue",
    ],
    techStack: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Redis",
    ],
    repoUrl: "https://github.com/NghiaUT/NUS-Final-App",
    demoUrl: "https://nus-final-app.vercel.app",
  },
  {
    id: "eventpass",
    title: "EventPass",
    role: "Business Analyst → Fullstack Developer",
    description:
      "Event ticketing platform with dynamic QR check-in and Google/Facebook login, built through a Scrum workflow.",
    highlights: [
      "Gathered requirements and mapped the booking/check-in business flow in early sprints",
      "Shipped features as a fullstack developer once the backlog moved into build phase",
      "Built a consistent React UX for the time-sensitive QR check-in flow",
    ],
    techStack: ["React", "Vite", "TailwindCSS"],
    repoUrl: "https://github.com/NghiaUT/EventPass_Frontend",
    demoUrl: "https://qldapm-front-end.vercel.app/",
  },
  {
    id: "coursecamp",
    title: "CourseCamp",
    role: "Fullstack Developer",
    description:
      "Online course management and payment platform, developed as a university capstone project (HK251).",
    highlights: [
      "Designed the backend API and data model for course management and payments",
      "Built the matching frontend to consume the API end to end",
    ],
    techStack: ["React", "Node.js", "Express", "JavaScript"],
    repoUrl: "https://github.com/NghiaUT/CourseCamp_Frontend",
    secondaryRepoUrl: "https://github.com/NghiaUT/CourseCamp-Backend",
    secondaryRepoLabel: "Backend Repo",
  },
  {
    id: "student-management",
    title: "Student Management System",
    role: "Fullstack Developer",
    description:
      "Advanced Software Lab exercise: a student management system built end to end, from API and database to frontend.",
    highlights: [
      "Designed the database schema and REST API for student records",
      "Built the frontend interface consuming the API",
    ],
    techStack: ["HTML", "JavaScript", "Node.js"],
    repoUrl: "https://github.com/NghiaUT/Advanced-Software-Lab",
  },
];

// TODO: replace with your real email address before deploying
export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "nghia.trantrong0905@gmail.com",
    href: "mailto:nghia.trantrong0905@gmail.com",
    icon: "email",
  },
  {
    label: "GitHub",
    value: "github.com/NghiaUT",
    href: "https://github.com/NghiaUT",
    icon: "github",
  },
  {
    label: "LinkedIn",
    value: "in/tran-nghia",
    href: "https://www.linkedin.com/in/tr%E1%BA%A7n-ngh%C4%A9a-23ba28339/",
    icon: "linkedin",
  },
];

export const TECH_ICONS = [
  {
    name: "JavaScript",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "React",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  {
    name: "PostgreSQL",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MySQL",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "Redis",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    name: "Python",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Java",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "C++",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    name: "TailwindCSS",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
] as const;
