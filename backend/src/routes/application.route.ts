import { Router } from "express";
import * as applicationController from "../controllers/application.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validations/application.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createApplicationSchema),
  applicationController.createApplication,
);
router.get("/", authenticate, applicationController.getApplications);
router.get("/:id", authenticate, applicationController.getApplicationById);
router.patch(
  "/:id",
  authenticate,
  validate(updateApplicationSchema),
  applicationController.updateApplication,
);
router.delete("/:id", authenticate, applicationController.deleteApplication);

export default router;
