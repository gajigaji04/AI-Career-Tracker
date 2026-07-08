"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post("/cover-letter", ai_controller_1.coverLetterController);
router.post("/interview-questions", ai_controller_1.interviewQuestionsController);
router.get("/analyses/:applicationId", ai_controller_1.getAiAnalysesController);
exports.default = router;
//# sourceMappingURL=ai.route.js.map