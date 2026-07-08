"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.getResumes = exports.uploadResume = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_1 = require("../config/s3");
const prisma_1 = require("../prisma/prisma");
const AppError_1 = require("../errors/AppError");
const uploadResume = async (userId, file) => {
    const existing = await prisma_1.prisma.resume.findMany({ where: { userId } });
    const nextVersion = existing.length > 0
        ? Math.max(...existing.map((r) => r.version)) + 1
        : 1;
    const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
    const key = `resumes/${userId}/${Date.now()}-${originalName}`;
    await s3_1.s3.send(new client_s3_1.PutObjectCommand({
        Bucket: s3_1.BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));
    const fileUrl = `https://${s3_1.BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return prisma_1.prisma.resume.create({
        data: {
            fileName: originalName,
            fileUrl,
            version: nextVersion,
            userId,
        },
    });
};
exports.uploadResume = uploadResume;
const getResumes = async (userId) => {
    return prisma_1.prisma.resume.findMany({
        where: { userId },
        orderBy: { version: "desc" },
    });
};
exports.getResumes = getResumes;
const deleteResume = async (id, userId) => {
    const resume = await prisma_1.prisma.resume.findFirst({ where: { id, userId } });
    if (!resume)
        throw new AppError_1.AppError("이력서를 찾을 수 없습니다.", 404);
    const key = resume.fileUrl.split(".amazonaws.com/")[1];
    if (key) {
        await s3_1.s3.send(new client_s3_1.DeleteObjectCommand({ Bucket: s3_1.BUCKET, Key: key }));
    }
    await prisma_1.prisma.resume.delete({ where: { id } });
};
exports.deleteResume = deleteResume;
//# sourceMappingURL=resume.service.js.map