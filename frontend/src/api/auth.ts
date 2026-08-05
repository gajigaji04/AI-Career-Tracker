import { api } from "./axios";
import type { RegisterRequest } from "../types/auth";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
