import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateCoverLetter, generateInterviewQuestions, getAiAnalyses } from "../services/ai.service";

export const coverLetterController = async (req: AuthRequest, res: Response) => {
  const result = await generateCoverLetter(req.userId!, req.body.applicationId as string);
  res.status(201).json({ success: true, data: result });
};

export const interviewQuestionsController = async (req: AuthRequest, res: Response) => {
  const result = await generateInterviewQuestions(req.userId!, req.body.applicationId as string);
  res.status(201).json({ success: true, data: result });
};

export const getAiAnalysesController = async (req: AuthRequest, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const results = await getAiAnalyses(req.userId!, applicationId);
  res.json({ success: true, data: results });
};
