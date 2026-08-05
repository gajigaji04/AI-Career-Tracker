import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as studyService from "../services/study.service";

export const createStudy = async (req: AuthRequest, res: Response) => {
  const study = await studyService.createStudy(req.userId!, req.body);

  res.status(201).json({
    success: true,
    data: study,
  });
};

export const getStudies = async (req: AuthRequest, res: Response) => {
  const studies = await studyService.getStudies(req.userId!);

  res.status(200).json({
    success: true,
    data: studies,
  });
};

export const getStudyById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const study = await studyService.getStudyById(id, req.userId!);

  res.status(200).json({
    success: true,
    data: study,
  });
};

export const updateStudy = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const study = await studyService.updateStudy(
    id,
    req.userId!,
    req.body,
  );

  res.status(200).json({
    success: true,
    data: study,
  });
};

export const deleteStudy = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await studyService.deleteStudy(id, req.userId!);

  res.status(200).json({
    success: true,
    message: "삭제 완료",
  });
};
