import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";
import { logger } from "../config/logger";
import { sendSms } from "./sms.service";
import type { ExperienceLevel } from "@prisma/client";

const getResendClient = () => new Resend(process.env.RESEND_API_KEY);
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const PHONE_CODE_TTL_MS = 5 * 60 * 1000;

interface RegisterDto {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone?: string;
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
  phone,
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
      phone: phone ?? null,
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
    { userId: user.id, tokenVersion: user.tokenVersion },
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

export const refreshAccessToken = async (refreshToken: string) => {
  let payload: { userId: string; tokenVersion: number };

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
      tokenVersion: number;
    };
  } catch {
    throw new AppError("유효하지 않은 리프레시 토큰입니다.", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  // tokenVersion이 달라졌다는 건 로그아웃 등으로 이 리프레시 토큰이 무효화됐다는 뜻
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new AppError("유효하지 않은 리프레시 토큰입니다.", 401);
  }

  const newAccessToken = jwt.sign(
    { userId: payload.userId },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );

  return { accessToken: newAccessToken };
};

// 발급된 모든 리프레시 토큰을 한 번에 무효화 (로그아웃 시 호출)
export const revokeRefreshTokens = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
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
      // 비밀번호가 유출돼서 재설정하는 상황일 수 있으므로, 그 전에 발급된
      // refresh token은 새 비밀번호와 무관하게 전부 무효화한다.
      tokenVersion: { increment: 1 },
    },
  });
};

// 아이디(이메일) 찾기: 휴대폰 번호로 6자리 인증번호 발송
export const requestFindEmail = async (phone: string) => {
  const user = await prisma.user.findUnique({ where: { phone } });

  // 등록되지 않은 번호여도 항상 같은 방식으로 동작 (번호 등록 여부 노출 방지)
  if (!user) return;

  const code = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + PHONE_CODE_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerificationCode: code, phoneVerificationCodeExpiresAt: expiresAt },
  });

  try {
    await sendSms(phone, `[CareerHub] 아이디 찾기 인증번호는 ${code}입니다. 5분 이내에 입력해주세요.`);
  } catch (err) {
    logger.error({ err }, "find-email SMS failed to send");
  }
};

// 인증번호 확인 후 마스킹 없이 이메일 반환 (휴대폰 소유를 이미 증명했으므로)
export const verifyFindEmail = async (phone: string, code: string) => {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (
    !user ||
    !user.phoneVerificationCode ||
    !user.phoneVerificationCodeExpiresAt ||
    user.phoneVerificationCode !== code ||
    user.phoneVerificationCodeExpiresAt < new Date()
  ) {
    throw new AppError("인증번호가 올바르지 않거나 만료되었습니다.", 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerificationCode: null, phoneVerificationCodeExpiresAt: null },
  });

  return { email: user.email };
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
