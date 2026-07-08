"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const resume_controller_1 = require("../controllers/resume.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowed = ["application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        cb(null, allowed.includes(file.mimetype));
    },
});
router.use(auth_middleware_1.authenticate);
router.get("/", resume_controller_1.getResumesController);
router.post("/", upload.single("file"), resume_controller_1.uploadResumeController);
router.delete("/:id", resume_controller_1.deleteResumeController);
exports.default = router;
//# sourceMappingURL=resume.route.js.map