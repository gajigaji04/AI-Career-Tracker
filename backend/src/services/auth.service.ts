import bcrypt from "bcrypt";
import { prisma } from "../prisma/prisma";

interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export const register = async ({ email, password, name }: RegisterDto) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return user;
};
