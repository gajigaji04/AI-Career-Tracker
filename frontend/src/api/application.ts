import { api } from "./axios";

export type ApplicationStatus = "APPLIED" | "DOCUMENT_PASS" | "INTERVIEW" | "FINAL_PASS" | "REJECTED";

export const getApplications = async () => {
  const res = await api.get("/applications");
  return res.data;
};

export const createApplication = async (data: {
  companyName: string;
  position: string;
  status: ApplicationStatus;
  appliedAt?: string;
  memo?: string;
}) => {
  const res = await api.post("/applications", data);
  return res.data;
};

export const updateApplication = async (id: string, data: {
  companyName?: string;
  position?: string;
  status?: ApplicationStatus;
  memo?: string;
}) => {
  const res = await api.patch(`/applications/${id}`, data);
  return res.data;
};

export const deleteApplication = async (id: string) => {
  const res = await api.delete(`/applications/${id}`);
  return res.data;
};
