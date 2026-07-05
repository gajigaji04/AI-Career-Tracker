import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  coverLetterController,
  interviewQuestionsController,
  getAiAnalysesController,
} from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

router.post("/cover-letter", coverLetterController);
router.post("/interview-questions", interviewQuestionsController);
router.get("/analyses/:applicationId", getAiAnalysesController);

export default router;
