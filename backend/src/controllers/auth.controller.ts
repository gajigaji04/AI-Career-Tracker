import { Request, Response } from "express";
import jwt from "jsonwebtoken";
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

  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTS);

  res.status(200).json({ success: true });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (refreshToken) {
    try {
      // 만료된 리프레시 토큰이라도(서명은 유효) 무효화는 시도한다
      const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, {
        ignoreExpiration: true,
      }) as { userId: string };

      await authService.revokeRefreshTokens(userId);
    } catch {
      // 위조된 토큰이면 무효화할 대상이 없으므로 그냥 쿠키만 지우고 넘어감
    }
  }

  res.clearCookie("accessToken", { httpOnly: true, sameSite: "lax" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
  res.status(200).json({ success: true });
};

export const forgotPassword = async (req: Request, res: Response) => {
  await authService.requestPasswordReset(req.body.email as string);

  res.status(200).json({
    success: true,
    message: "입력하신 이메일이 가입되어 있다면, 비밀번호 재설정 링크를 발송했습니다.",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token as string, req.body.password as string);

  res.status(200).json({ success: true, message: "비밀번호가 재설정되었습니다." });
};

export const requestFindEmail = async (req: Request, res: Response) => {
  await authService.requestFindEmail(req.body.phone as string);

  res.status(200).json({
    success: true,
    message: "입력하신 번호가 가입되어 있다면, 인증번호를 발송했습니다.",
  });
};

export const verifyFindEmail = async (req: Request, res: Response) => {
  const { email } = await authService.verifyFindEmail(
    req.body.phone as string,
    req.body.code as string,
  );

  res.status(200).json({ success: true, data: { email } });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.userId!);

  res.status(200).json({
    success: true,
    data: user,
  });
};
