import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const ACCESS_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 1000,
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, user } = await authService.login(email, password);

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTS);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTS);

  res.status(200).json({
    success: true,
    data: { user },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    res.status(400).json({
      success: false,
      message: "리프레시 토큰이 없습니다.",
    });
    return;
  }

  const { accessToken } = authService.refreshAccessToken(refreshToken);

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTS);

  res.status(200).json({ success: true });
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "lax" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
  res.status(200).json({ success: true });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.userId!);

  res.status(200).json({
    success: true,
    data: user,
  });
};
