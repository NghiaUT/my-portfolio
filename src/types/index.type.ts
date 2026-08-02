export type Theme = "dark" | "light";

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  description: string;
  highlights: string[];
  techStack: string[];
  repoUrl: string;
  secondaryRepoUrl?: string;
  secondaryRepoLabel?: string;
  demoUrl?: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: "github" | "linkedin" | "email";
}

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
