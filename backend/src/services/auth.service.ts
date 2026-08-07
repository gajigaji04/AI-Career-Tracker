import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";
import { logger } from "../config/logger";
import type { ExperienceLevel } from "@prisma/client";

const getResendClient = () => new Resend(process.env.RESEND_API_KEY);
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

interface RegisterDto {
  email: string;
  password: string;
  name: string;
  nickname: string;
  jobTitle?: string;
  experienceLevel?: ExperienceLevel;
  yearsOfExperience?: number;
  interestedStack?: string[];
}

export const register = async ({
  email,
  password,
  name,
  nickname,
  jobTitle,
  experienceLevel,
  yearsOfExperience,
  interestedStack,
}: RegisterDto) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      nickname,
      jobTitle: jobTitle ?? null,
      experienceLevel: experienceLevel ?? null,
      yearsOfExperience: yearsOfExperience ?? null,
      interestedStack: interestedStack ?? [],
    },
    select: { id: true, email: true, name: true, nickname: true },
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("사용자를 찾을 수 없습니다.", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("비밀번호가 일치하지 않습니다.", 401);
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "30d" },
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

export const refreshAccessToken = (refreshToken: string) => {
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { userId: string };

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    return { accessToken: newAccessToken };
  } catch {
    throw new AppError("유효하지 않은 리프레시 토큰입니다.", 401);
  }
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // 계정 존재 여부와 무관하게 항상 같은 방식으로 동작 (이메일 존재 여부 노출 방지)
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetTokenExpiresAt: expiresAt },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const { error } = await getResendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "CareerHub <onboarding@resend.dev>",
    to: email,
    subject: "[CareerHub] 비밀번호 재설정 안내",
    html: `<p>아래 링크를 눌러 비밀번호를 재설정해주세요. 이 링크는 1시간 동안 유효합니다.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.</p>`,
  });

  // 이메일 발송 실패해도 사용자에겐 항상 동일하게 응답 (열거 공격 방지) — 서버 로그로만 확인
  if (error) logger.error({ err: error }, "password reset email failed to send");
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { passwordResetToken: token } });

  if (
    !user ||
    !user.passwordResetTokenExpiresAt ||
    user.passwordResetTokenExpiresAt < new Date()
  ) {
    throw new AppError("유효하지 않거나 만료된 링크입니다.", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
  });
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return user;
};
