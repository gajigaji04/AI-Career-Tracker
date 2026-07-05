import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "../config/s3";
import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const existing = await prisma.resume.findMany({ where: { userId } });
  const nextVersion = existing.length > 0
    ? Math.max(...existing.map((r) => r.version)) + 1
    : 1;

  const key = `resumes/${userId}/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  const fileUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return prisma.resume.create({
    data: {
      fileName: file.originalname,
      fileUrl,
      version: nextVersion,
      userId,
    },
  });
};

export const getResumes = async (userId: string) => {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { version: "desc" },
  });
};

export const deleteResume = async (id: string, userId: string) => {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) throw new AppError("이력서를 찾을 수 없습니다.", 404);

  const key = resume.fileUrl.split(".amazonaws.com/")[1];
  if (key) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  }

  await prisma.resume.delete({ where: { id } });
};
