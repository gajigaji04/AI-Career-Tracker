import { prisma } from "../prisma/prisma";

export const getDashboardStats = async (userId: string) => {
  const studies = await prisma.study.count({
    where: { userId },
  });

  const projects = await prisma.project.count({
    where: { userId },
  });

  const applications = await prisma.application.count({
    where: { userId },
  });

  return {
    studies,
    projects,
    applications,
  };
};
