import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";

interface CreateApplicationDto {
  companyName: string;
  position: string;
  status: "APPLIED" | "DOCUMENT_PASS" | "INTERVIEW" | "FINAL_PASS" | "REJECTED";
  appliedAt?: string;
  memo?: string;
}

export const createApplication = async (
  userId: string,
  data: CreateApplicationDto,
) => {
  return prisma.application.create({
    data: {
      companyName: data.companyName,
      position: data.position,
      status: data.status,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : new Date(),
      memo: data.memo ?? null,
      userId,
    },
  });
};

export const getApplications = async (userId: string) => {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { appliedAt: "desc" },
  });
};

export const getApplicationById = async (id: string, userId: string) => {
  const application = await prisma.application.findFirst({
    where: { id, userId },
  });

  if (!application) {
    throw new AppError("지원 내역을 찾을 수 없습니다.", 404);
  }

  return application;
};

export const updateApplication = async (
  id: string,
  userId: string,
  data: {
    companyName?: string;
    position?: string;
    status?: "APPLIED" | "DOCUMENT_PASS" | "INTERVIEW" | "FINAL_PASS" | "REJECTED";
    memo?: string;
  },
) => {
  await getApplicationById(id, userId);

  return prisma.application.update({
    where: { id },
    data,
  });
};

export const deleteApplication = async (id: string, userId: string) => {
  await getApplicationById(id, userId);

  await prisma.application.delete({
    where: { id },
  });
};
