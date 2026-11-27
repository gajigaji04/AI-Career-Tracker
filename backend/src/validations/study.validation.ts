import { z } from "zod";

export const createStudySchema = z.object({
  title: z.string().min(1, "제목은 필수입니다."),
  content: z.string().min(1, "내용은 필수입니다."),
  category: z.string().min(1),
  studyTime: z.number().positive(),
  studyDate: z.string(),
});

// 수정은 부분 업데이트. 스키마에 없는 필드(userId 등)가 오면 400
export const updateStudySchema = createStudySchema.partial().strict();
