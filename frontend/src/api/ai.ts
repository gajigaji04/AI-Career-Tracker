import { api } from "./axios";

export type AiAnalysisType = "COVER_LETTER" | "INTERVIEW_QUESTIONS";

export type AiAnalysis = {
  id: string;
  type: AiAnalysisType;
  content: string;
  applicationId: string;
  createdAt: string;
};

export const generateCoverLetter = async (applicationId: string) => {
  const res = await api.post("/ai/cover-letter", { applicationId });
  return res.data;
};

export const generateInterviewQuestions = async (applicationId: string) => {
  const res = await api.post("/ai/interview-questions", { applicationId });
  return res.data;
};

export const getAiAnalyses = async (applicationId: string) => {
  const res = await api.get(`/ai/analyses/${applicationId}`);
  return res.data;
};
