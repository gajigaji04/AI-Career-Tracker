import { z } from "zod";

export const createStudySchema = z.object({
  title: z.string().min(1, "제목은 필수입니다."),
  content: z.string().min(1, "내용은 필수입니다."),
  category: z.string().min(1),
  studyTime: z.number().positive(),
  studyDate: z.string(),
});
