import { Router } from "express";
import * as studyController from "../controllers/study.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, studyController.createStudy);
router.get("/", authenticate, studyController.getStudies);
router.get("/:id", authenticate, studyController.getStudyById);
router.patch("/:id", authenticate, studyController.updateStudy);
router.delete("/:id", authenticate, studyController.deleteStudy);

export default router;
