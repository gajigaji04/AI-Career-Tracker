import { api } from "./axios";

export const getApplications = async () => {
  const res = await api.get("/applications");
  return res.data;
};

export const createApplication = async (data: {
  companyName: string;
  position: string;
  status: "APPLIED" | "DOCUMENT_PASS" | "INTERVIEW" | "FINAL_PASS" | "REJECTED";
  appliedAt?: string;
  memo?: string;
}) => {
  const res = await api.post("/applications", data);
  return res.data;
};
