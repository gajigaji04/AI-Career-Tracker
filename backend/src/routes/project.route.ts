import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createProjectSchema } from "../validations/project.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createProjectSchema),
  projectController.createProject,
);

router.get("/", authenticate, projectController.getProjects);

router.get("/:id", authenticate, projectController.getProjectById);

router.patch("/:id", authenticate, projectController.updateProject);

router.delete("/:id", authenticate, projectController.deleteProject);

export default router;
