import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as applicationService from "../services/application.service";

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const application = await applicationService.createApplication(
      req.userId!,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await applicationService.getApplications(req.userId!);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const application = await applicationService.getApplicationById(
      id,
      req.userId!,
    );

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const application = await applicationService.updateApplication(
      id,
      req.userId!,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await applicationService.deleteApplication(id, req.userId!);

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
