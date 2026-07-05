import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { uploadResume, getResumes, deleteResume } from "../services/resume.service";

export const uploadResumeController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "파일이 없습니다." });
      return;
    }
    const resume = await uploadResume(req.userId!, req.file);
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "업로드 중 오류가 발생했습니다.",
    });
  }
};

export const getResumesController = async (req: AuthRequest, res: Response) => {
  try {
    const resumes = await getResumes(req.userId!);
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "조회 중 오류가 발생했습니다.",
    });
  }
};

export const deleteResumeController = async (req: AuthRequest, res: Response) => {
  try {
    await deleteResume(req.params.id as string, req.userId!);
    res.json({ success: true, message: "삭제 완료" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
    });
  }
};
