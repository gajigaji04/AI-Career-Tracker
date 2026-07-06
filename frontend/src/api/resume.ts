import { api } from "./axios";

export type Resume = {
  id: string;
  fileName: string;
  fileUrl: string;
  version: number;
  createdAt: string;
};

export const getResumes = async () => {
  const res = await api.get("/resumes");
  return res.data;
};

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/resumes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteResume = async (id: string) => {
  const res = await api.delete(`/resumes/${id}`);
  return res.data;
};
