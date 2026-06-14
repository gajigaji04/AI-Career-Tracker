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
