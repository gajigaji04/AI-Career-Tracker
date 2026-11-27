import { prisma } from "../prisma/prisma";

export const getDashboardStats = async (userId: string) => {
  // 서로 독립적인 count 쿼리라 순차 대기 없이 병렬로 실행
  const [studies, projects, applications] = await Promise.all([
    prisma.study.count({ where: { userId } }),
    prisma.project.count({ where: { userId } }),
    prisma.application.count({ where: { userId } }),
  ]);

  return {
    studies,
    projects,
    applications,
  };
};
