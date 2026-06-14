import { prisma } from "../prisma/prisma";

interface CreateStudyDto {
  title: string;
  content: string;
  category: string;
  studyTime: number;
  studyDate: string;
}

export const createStudy = async (userId: string, data: CreateStudyDto) => {
  return prisma.study.create({
    data: {
      ...data,
      studyDate: new Date(data.studyDate),
      userId,
    },
  });
};

export const getStudies = async (userId: string) => {
  return prisma.study.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
