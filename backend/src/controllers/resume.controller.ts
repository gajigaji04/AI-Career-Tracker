import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { uploadResume, getResumes, deleteResume } from "../services/resume.service";

export const uploadResumeController = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "파일이 없습니다." });
    return;
  }
  const resume = await uploadResume(req.userId!, req.file);
  res.status(201).json({ success: true, data: resume });
};

export const getResumesController = async (req: AuthRequest, res: Response) => {
  const resumes = await getResumes(req.userId!);
  res.json({ success: true, data: resumes });
};

export const deleteResumeController = async (req: AuthRequest, res: Response) => {
  await deleteResume(req.params.id as string, req.userId!);
  res.json({ success: true, message: "삭제 완료" });
};
