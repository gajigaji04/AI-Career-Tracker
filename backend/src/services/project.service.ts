import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";

interface CreateProjectDto {
  title: string;
  description: string;
  githubUrl?: string;
  deployUrl?: string;
  techStack: string;
}

export const createProject = async (userId: string, data: CreateProjectDto) => {
  return prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      githubUrl: data.githubUrl ?? null,
      deployUrl: data.deployUrl ?? null,
      techStack: data.techStack.split(",").map((s) => s.trim()),
      userId,
    },
  });
};

export const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getProjectById = async (id: string, userId: string) => {
  const project = await prisma.project.findFirst({
    where: { id, userId },
  });

  if (!project) {
    throw new AppError("프로젝트를 찾을 수 없습니다.", 404);
  }

  return project;
};

export const updateProject = async (
  id: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    githubUrl?: string;
    deployUrl?: string;
    techStack?: string;
  },
) => {
  await getProjectById(id, userId);

  const updateData: {
    title?: string;
    description?: string;
    githubUrl?: string;
    deployUrl?: string;
    techStack?: string[];
  } = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
  if (data.deployUrl !== undefined) updateData.deployUrl = data.deployUrl;
  if (data.techStack !== undefined)
    updateData.techStack = data.techStack.split(",").map((s) => s.trim());

  return prisma.project.update({
    where: { id },
    data: updateData,
  });
};

export const deleteProject = async (id: string, userId: string) => {
  await getProjectById(id, userId);

  await prisma.project.delete({
    where: { id },
  });
};
