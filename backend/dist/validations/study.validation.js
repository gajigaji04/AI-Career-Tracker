"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudySchema = void 0;
const zod_1 = require("zod");
exports.createStudySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "제목은 필수입니다."),
    content: zod_1.z.string().min(1, "내용은 필수입니다."),
    category: zod_1.z.string().min(1),
    studyTime: zod_1.z.number().positive(),
    studyDate: zod_1.z.string(),
});
//# sourceMappingURL=study.validation.js.map