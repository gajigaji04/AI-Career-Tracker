"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getApplicationById = exports.getApplications = exports.createApplication = void 0;
const prisma_1 = require("../prisma/prisma");
const AppError_1 = require("../errors/AppError");
const createApplication = async (userId, data) => {
    return prisma_1.prisma.application.create({
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
exports.createApplication = createApplication;
const getApplications = async (userId) => {
    return prisma_1.prisma.application.findMany({
        where: { userId },
        orderBy: { appliedAt: "desc" },
    });
};
exports.getApplications = getApplications;
const getApplicationById = async (id, userId) => {
    const application = await prisma_1.prisma.application.findFirst({
        where: { id, userId },
    });
    if (!application) {
        throw new AppError_1.AppError("지원 내역을 찾을 수 없습니다.", 404);
    }
    return application;
};
exports.getApplicationById = getApplicationById;
const updateApplication = async (id, userId, data) => {
    await (0, exports.getApplicationById)(id, userId);
    return prisma_1.prisma.application.update({
        where: { id },
        data,
    });
};
exports.updateApplication = updateApplication;
const deleteApplication = async (id, userId) => {
    await (0, exports.getApplicationById)(id, userId);
    await prisma_1.prisma.application.delete({
        where: { id },
    });
};
exports.deleteApplication = deleteApplication;
//# sourceMappingURL=application.service.js.map