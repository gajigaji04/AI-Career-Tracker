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

export const getStudyById = async (id: string, userId: string) => {
  const study = await prisma.study.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!study) {
    throw new Error("학습 기록을 찾을 수 없습니다.");
  }

  return study;
};

export const updateStudy = async (
  id: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
    category?: string;
    studyTime?: number;
  },
) => {
  await getStudyById(id, userId);

  return prisma.study.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteStudy = async (id: string, userId: string) => {
  await getStudyById(id, userId);

  await prisma.study.delete({
    where: {
      id,
    },
  });

  return;
};
