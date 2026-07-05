import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateCoverLetter, generateInterviewQuestions, getAiAnalyses } from "../services/ai.service";

export const coverLetterController = async (req: AuthRequest, res: Response) => {
  try {
    const result = await generateCoverLetter(req.userId!, req.body.applicationId as string);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "자소서 생성 중 오류가 발생했습니다.",
    });
  }
};

export const interviewQuestionsController = async (req: AuthRequest, res: Response) => {
  try {
    const result = await generateInterviewQuestions(req.userId!, req.body.applicationId as string);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "면접 질문 생성 중 오류가 발생했습니다.",
    });
  }
};

export const getAiAnalysesController = async (req: AuthRequest, res: Response) => {
  try {
    const applicationId = req.params.applicationId as string;
    const results = await getAiAnalyses(req.userId!, applicationId);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "조회 중 오류가 발생했습니다.",
    });
  }
};
