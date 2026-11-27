import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, BUCKET } from "../config/s3";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";
import { logger } from "../config/logger";

const DOWNLOAD_URL_TTL_SECONDS = 5 * 60;
// 동시 업로드로 버전 unique 제약(userId, version)이 충돌했을 때 재시도 횟수
const MAX_VERSION_RETRIES = 3;

// 클라이언트가 보낸 mimetype 은 위조 가능하므로, 파일 앞부분 시그니처(magic byte)로 실제 형식을 확인
const FILE_SIGNATURES: Record<string, number[]> = {
  "application/pdf": [0x25, 0x50, 0x44, 0x46, 0x2d], // %PDF-
  "application/msword": [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], // OLE2 (.doc)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [0x50, 0x4b, 0x03, 0x04], // ZIP (.docx)
};

export const hasValidSignature = (mimetype: string, buffer: Buffer) => {
  const signature = FILE_SIGNATURES[mimetype];
  if (!signature || buffer.length < signature.length) return false;
  return signature.every((byte, i) => buffer[i] === byte);
};

const isVersionConflict = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

const getNextVersion = async (userId: string) => {
  const { _max } = await prisma.resume.aggregate({
    where: { userId },
    _max: { version: true },
  });
  return (_max.version ?? 0) + 1;
};

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File,
) => {
  if (!hasValidSignature(file.mimetype, file.buffer)) {
    throw new AppError("PDF, DOC, DOCX 파일만 업로드할 수 있습니다.", 400);
  }

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

  try {
    for (let attempt = 1; ; attempt++) {
      try {
        return await prisma.resume.create({
          data: {
            fileName: originalName,
            fileUrl,
            version: await getNextVersion(userId),
            userId,
          },
        });
      } catch (error) {
        // 동시 업로드로 같은 버전을 먼저 가져간 경우 → 버전을 다시 계산해서 재시도
        if (isVersionConflict(error) && attempt < MAX_VERSION_RETRIES) continue;
        throw error;
      }
    }
  } catch (error) {
    // DB 저장에 실패하면 방금 올린 S3 객체를 지워 고아 객체를 남기지 않는다
    await s3
      .send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
      .catch((cleanupErr: unknown) =>
        logger.error({ err: cleanupErr, key }, "orphan S3 object cleanup failed"),
      );

    if (isVersionConflict(error)) {
      throw new AppError("동시에 업로드된 이력서가 있습니다. 잠시 후 다시 시도해주세요.", 409);
    }
    throw error;
  }
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
