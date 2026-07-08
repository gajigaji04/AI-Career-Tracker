"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    githubUrl: zod_1.z.string().url().optional(),
    deployUrl: zod_1.z.string().url().optional(),
    techStack: zod_1.z.string().min(1),
});
//# sourceMappingURL=project.validation.js.map