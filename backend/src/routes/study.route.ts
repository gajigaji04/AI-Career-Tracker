import { Router } from "express";
import * as studyController from "../controllers/study.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, studyController.createStudy);
router.get("/", authenticate, studyController.getStudies);

export default router;
