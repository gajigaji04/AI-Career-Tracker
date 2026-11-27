import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";
import type { Prisma } from "@prisma/client";

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
      title: data.title,
      content: data.content,
      category: data.category,
      studyTime: data.studyTime,
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
    throw new AppError("학습 기록을 찾을 수 없습니다.", 404);
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
    studyDate?: string;
  },
) => {
  await getStudyById(id, userId);

  // 요청 객체를 그대로 넘기지 않고 허용 필드만 골라서 전달 (userId 등 변경 차단)
  const updateData: Prisma.StudyUpdateInput = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.studyTime !== undefined) updateData.studyTime = data.studyTime;
  if (data.studyDate !== undefined) updateData.studyDate = new Date(data.studyDate);

  return prisma.study.update({
    where: {
      id,
    },
    data: updateData,
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
