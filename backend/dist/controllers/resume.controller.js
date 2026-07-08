"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResumeController = exports.getResumesController = exports.uploadResumeController = void 0;
const resume_service_1 = require("../services/resume.service");
const uploadResumeController = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "파일이 없습니다." });
            return;
        }
        const resume = await (0, resume_service_1.uploadResume)(req.userId, req.file);
        res.status(201).json({ success: true, data: resume });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "업로드 중 오류가 발생했습니다.",
        });
    }
};
exports.uploadResumeController = uploadResumeController;
const getResumesController = async (req, res) => {
    try {
        const resumes = await (0, resume_service_1.getResumes)(req.userId);
        res.json({ success: true, data: resumes });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "조회 중 오류가 발생했습니다.",
        });
    }
};
exports.getResumesController = getResumesController;
const deleteResumeController = async (req, res) => {
    try {
        await (0, resume_service_1.deleteResume)(req.params.id, req.userId);
        res.json({ success: true, message: "삭제 완료" });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
        });
    }
};
exports.deleteResumeController = deleteResumeController;
//# sourceMappingURL=resume.controller.js.map