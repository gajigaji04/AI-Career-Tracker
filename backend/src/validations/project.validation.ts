import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),

  githubUrl: z.string().url().optional(),

  deployUrl: z.string().url().optional(),

  techStack: z.string().min(1),
});

// 수정은 부분 업데이트. 스키마에 없는 필드(userId 등)가 오면 400
export const updateProjectSchema = createProjectSchema.partial().strict();
