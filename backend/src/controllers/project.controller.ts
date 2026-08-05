import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as projectService from "../services/project.service";

export const createProject = async (req: AuthRequest, res: Response) => {
  const project = await projectService.createProject(req.userId!, req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  const projects = await projectService.getProjects(req.userId!);

  res.status(200).json({
    success: true,
    data: projects,
  });
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const project = await projectService.getProjectById(id, req.userId!);

  res.status(200).json({
    success: true,
    data: project,
  });
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const project = await projectService.updateProject(
    id,
    req.userId!,
    req.body,
  );

  res.status(200).json({
    success: true,
    data: project,
  });
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await projectService.deleteProject(id, req.userId!);

  res.status(200).json({
    success: true,
    message: "삭제 완료",
  });
};
