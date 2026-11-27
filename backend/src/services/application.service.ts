import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";
import type { Prisma } from "@prisma/client";

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

  // 요청 객체를 그대로 넘기지 않고 허용 필드만 골라서 전달 (userId 등 변경 차단)
  const updateData: Prisma.ApplicationUpdateInput = {};
  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.position !== undefined) updateData.position = data.position;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.memo !== undefined) updateData.memo = data.memo;

  return prisma.application.update({
    where: { id },
    data: updateData,
  });
};

export const deleteApplication = async (id: string, userId: string) => {
  await getApplicationById(id, userId);

  await prisma.application.delete({
    where: { id },
  });
};
