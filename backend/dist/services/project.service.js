"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const prisma_1 = require("../prisma/prisma");
const AppError_1 = require("../errors/AppError");
const createProject = async (userId, data) => {
    return prisma_1.prisma.project.create({
        data: {
            title: data.title,
            description: data.description,
            githubUrl: data.githubUrl ?? null,
            deployUrl: data.deployUrl ?? null,
            techStack: data.techStack.split(",").map((s) => s.trim()),
            userId,
        },
    });
};
exports.createProject = createProject;
const getProjects = async (userId) => {
    return prisma_1.prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};
exports.getProjects = getProjects;
const getProjectById = async (id, userId) => {
    const project = await prisma_1.prisma.project.findFirst({
        where: { id, userId },
    });
    if (!project) {
        throw new AppError_1.AppError("프로젝트를 찾을 수 없습니다.", 404);
    }
    return project;
};
exports.getProjectById = getProjectById;
const updateProject = async (id, userId, data) => {
    await (0, exports.getProjectById)(id, userId);
    const updateData = {};
    if (data.title !== undefined)
        updateData.title = data.title;
    if (data.description !== undefined)
        updateData.description = data.description;
    if (data.githubUrl !== undefined)
        updateData.githubUrl = data.githubUrl;
    if (data.deployUrl !== undefined)
        updateData.deployUrl = data.deployUrl;
    if (data.techStack !== undefined)
        updateData.techStack = data.techStack.split(",").map((s) => s.trim());
    return prisma_1.prisma.project.update({
        where: { id },
        data: updateData,
    });
};
exports.updateProject = updateProject;
const deleteProject = async (id, userId) => {
    await (0, exports.getProjectById)(id, userId);
    await prisma_1.prisma.project.delete({
        where: { id },
    });
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=project.service.js.map