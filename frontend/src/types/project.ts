export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string | string[];
  githubUrl?: string;
  deployUrl?: string;
}
