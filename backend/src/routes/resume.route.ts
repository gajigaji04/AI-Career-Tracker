import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware";
import {
  uploadResumeController,
  getResumesController,
  deleteResumeController,
} from "../controllers/resume.controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.use(authenticate);

router.get("/", getResumesController);
router.post("/", upload.single("file"), uploadResumeController);
router.delete("/:id", deleteResumeController);

export default router;
