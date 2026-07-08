"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiAnalysesController = exports.interviewQuestionsController = exports.coverLetterController = void 0;
const ai_service_1 = require("../services/ai.service");
const coverLetterController = async (req, res) => {
    try {
        const result = await (0, ai_service_1.generateCoverLetter)(req.userId, req.body.applicationId);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "자소서 생성 중 오류가 발생했습니다.",
        });
    }
};
exports.coverLetterController = coverLetterController;
const interviewQuestionsController = async (req, res) => {
    try {
        const result = await (0, ai_service_1.generateInterviewQuestions)(req.userId, req.body.applicationId);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "면접 질문 생성 중 오류가 발생했습니다.",
        });
    }
};
exports.interviewQuestionsController = interviewQuestionsController;
const getAiAnalysesController = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const results = await (0, ai_service_1.getAiAnalyses)(req.userId, applicationId);
        res.json({ success: true, data: results });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "조회 중 오류가 발생했습니다.",
        });
    }
};
exports.getAiAnalysesController = getAiAnalysesController;
//# sourceMappingURL=ai.controller.js.map