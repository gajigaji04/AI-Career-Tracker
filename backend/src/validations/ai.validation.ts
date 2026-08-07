import { z } from "zod";

export const generateAnalysisSchema = z.object({
  applicationId: z.string().min(1, "지원 내역 ID는 필수입니다."),
});
