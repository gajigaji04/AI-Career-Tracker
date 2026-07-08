"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = require("../prisma/prisma");
const getDashboardStats = async (userId) => {
    const studies = await prisma_1.prisma.study.count({
        where: { userId },
    });
    const projects = await prisma_1.prisma.project.count({
        where: { userId },
    });
    const applications = await prisma_1.prisma.application.count({
        where: { userId },
    });
    return {
        studies,
        projects,
        applications,
    };
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboard.service.js.map