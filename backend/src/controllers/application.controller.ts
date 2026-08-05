import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as applicationService from "../services/application.service";

export const createApplication = async (req: AuthRequest, res: Response) => {
  const application = await applicationService.createApplication(
    req.userId!,
    req.body,
  );

  res.status(201).json({
    success: true,
    data: application,
  });
};

export const getApplications = async (req: AuthRequest, res: Response) => {
  const applications = await applicationService.getApplications(req.userId!);

  res.status(200).json({
    success: true,
    data: applications,
  });
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const application = await applicationService.getApplicationById(
    id,
    req.userId!,
  );

  res.status(200).json({
    success: true,
    data: application,
  });
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
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
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await applicationService.deleteApplication(id, req.userId!);

  res.status(200).json({
    success: true,
    message: "삭제 완료",
  });
};
