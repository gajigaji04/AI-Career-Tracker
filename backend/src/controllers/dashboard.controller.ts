import { Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const stats = await dashboardService.getDashboardStats(req.userId!);

  res.status(200).json({
    success: true,
    data: stats,
  });
};
