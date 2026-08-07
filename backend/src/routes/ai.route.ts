import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { aiLimiter } from "../middlewares/rateLimit.middleware";
import { generateAnalysisSchema } from "../validations/ai.validation";
import {
  coverLetterController,
  interviewQuestionsController,
  getAiAnalysesController,
} from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

router.post("/cover-letter", aiLimiter, validate(generateAnalysisSchema), coverLetterController);
router.post(
  "/interview-questions",
  aiLimiter,
  validate(generateAnalysisSchema),
  interviewQuestionsController,
);
router.get("/analyses/:applicationId", getAiAnalysesController);

export default router;
