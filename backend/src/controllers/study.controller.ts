import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as studyService from "../services/study.service";

export const createStudy = async (req: AuthRequest, res: Response) => {
  try {
    const study = await studyService.createStudy(req.userId!, req.body);

    res.status(201).json({
      success: true,
      data: study,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const getStudies = async (req: AuthRequest, res: Response) => {
  try {
    const studies = await studyService.getStudies(req.userId!);

    res.status(200).json({
      success: true,
      data: studies,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const getStudyById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const study = await studyService.getStudyById(id, req.userId!);

    res.status(200).json({
      success: true,
      data: study,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const updateStudy = async (req: AuthRequest, res: Response) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const deleteStudy = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await studyService.deleteStudy(id, req.userId!);

    res.status(200).json({
      success: true,
      message: "삭제 완료",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};
