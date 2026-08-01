import { api } from "./axios";

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  deployUrl?: string;
};

export const getProjects = async () => {
  const res = await api.get<{ success: boolean; data: Project[] }>("/projects");
  return res.data;
};

export const createProject = async (data: {
  title: string;
  description: string;
  githubUrl?: string;
  deployUrl?: string;
  techStack: string;
}) => {
  const res = await api.post("/projects", data);
  return res.data;
};

export const updateProject = async (id: string, data: {
  title?: string;
  description?: string;
  githubUrl?: string;
  deployUrl?: string;
  techStack?: string;
}) => {
  const res = await api.patch(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};
