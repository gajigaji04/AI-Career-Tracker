import { z } from "zod";

const PHONE_REGEX = /^01[0-9]{8,9}$/;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  nickname: z.string().min(1),
  phone: z.string().regex(PHONE_REGEX, "휴대폰 번호 형식이 올바르지 않습니다.").optional(),

  jobTitle: z.string().optional(),
  experienceLevel: z
    .enum(["STUDENT", "JOB_SEEKER", "NEW_DEVELOPER", "JUNIOR_DEVELOPER", "EXPERIENCED_DEVELOPER"])
    .optional(),
  yearsOfExperience: z.number().int().min(0).max(60).optional(),
  interestedStack: z.array(z.string()).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export const findEmailRequestSchema = z.object({
  phone: z.string().regex(PHONE_REGEX, "휴대폰 번호 형식이 올바르지 않습니다."),
});

export const findEmailVerifySchema = z.object({
  phone: z.string().regex(PHONE_REGEX, "휴대폰 번호 형식이 올바르지 않습니다."),
  code: z.string().length(6),
});
