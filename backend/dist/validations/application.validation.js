"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1),
    position: zod_1.z.string().min(1),
    status: zod_1.z.enum([
        "APPLIED",
        "DOCUMENT_PASS",
        "INTERVIEW",
        "FINAL_PASS",
        "REJECTED",
    ]),
    appliedAt: zod_1.z.string().optional(),
    memo: zod_1.z.string().optional(),
});
exports.updateApplicationSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1).optional(),
    position: zod_1.z.string().min(1).optional(),
    status: zod_1.z
        .enum(["APPLIED", "DOCUMENT_PASS", "INTERVIEW", "FINAL_PASS", "REJECTED"])
        .optional(),
    memo: zod_1.z.string().optional(),
});
//# sourceMappingURL=application.validation.js.map