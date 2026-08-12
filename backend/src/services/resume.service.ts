import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, BUCKET } from "../config/s3";
import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";

const DOWNLOAD_URL_TTL_SECONDS = 5 * 60;

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const existing = await prisma.resume.findMany({ where: { userId } });
  const nextVersion =
    existing.length > 0
      ? Math.max(...existing.map((r: (typeof existing)[number]) => r.version)) +
        1
      : 1;

  const originalName = Buffer.from(file.originalname, "latin1").toString(
    "utf8",
  );
  const key = `resumes/${userId}/${Date.now()}-${originalName}`;

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
      fileName: originalName,
      fileUrl,
      version: nextVersion,
      userId,
    },
  });
};

// S3 버킷이 퍼블릭 액세스 차단으로 바뀐 뒤로, DB에 저장된 fileUrl(고정 S3 주소)은
// 더 이상 브라우저에서 직접 열리지 않는다. 목록 조회 때마다 그 자리에서 짧게만
// 유효한 서명 URL로 바꿔서 내려준다 (이력서는 개인정보라 영구 공개 링크를 피하는 목적도 겸함).
export const getResumes = async (userId: string) => {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { version: "desc" },
  });

  return Promise.all(
    resumes.map(async (resume: (typeof resumes)[number]) => {
      const key = resume.fileUrl.split(".amazonaws.com/")[1];
      if (!key) return resume;

      const fileUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
        { expiresIn: DOWNLOAD_URL_TTL_SECONDS },
      );

      return { ...resume, fileUrl };
    }),
  );
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
