import { api } from "./axios";

export const getStudies = async () => {
  const res = await api.get("/studies");
  return res.data;
};

export const createStudy = async (data: {
  title: string;
  content: string;
  category: string;
  studyTime: number;
  studyDate: string;
}) => {
  const res = await api.post("/studies", data);
  return res.data;
};
