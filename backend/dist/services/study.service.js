"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudy = exports.updateStudy = exports.getStudyById = exports.getStudies = exports.createStudy = void 0;
const prisma_1 = require("../prisma/prisma");
const AppError_1 = require("../errors/AppError");
const createStudy = async (userId, data) => {
    return prisma_1.prisma.study.create({
        data: {
            ...data,
            studyDate: new Date(data.studyDate),
            userId,
        },
    });
};
exports.createStudy = createStudy;
const getStudies = async (userId) => {
    return prisma_1.prisma.study.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getStudies = getStudies;
const getStudyById = async (id, userId) => {
    const study = await prisma_1.prisma.study.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!study) {
        throw new AppError_1.AppError("학습 기록을 찾을 수 없습니다.", 404);
    }
    return study;
};
exports.getStudyById = getStudyById;
const updateStudy = async (id, userId, data) => {
    await (0, exports.getStudyById)(id, userId);
    return prisma_1.prisma.study.update({
        where: {
            id,
        },
        data,
    });
};
exports.updateStudy = updateStudy;
const deleteStudy = async (id, userId) => {
    await (0, exports.getStudyById)(id, userId);
    await prisma_1.prisma.study.delete({
        where: {
            id,
        },
    });
    return;
};
exports.deleteStudy = deleteStudy;
//# sourceMappingURL=study.service.js.map