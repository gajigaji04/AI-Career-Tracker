import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";

interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

// 토큰 만료 처리 구현하기 — Axios 인터셉터에서 401 받으면 자동 로그아웃. 지금 없음. 3~40줄짜리 작업인데 "인증 플로우 완성했다"고 말할 수 있음
export const register = async ({ email, password, name }: RegisterDto) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true },
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("사용자를 찾을 수 없습니다.", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("비밀번호가 일치하지 않습니다.", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return user;
};
