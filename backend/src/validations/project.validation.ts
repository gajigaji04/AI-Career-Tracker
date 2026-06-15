import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),

  githubUrl: z.string().url().optional(),

  deployUrl: z.string().url().optional(),

  techStack: z.string().min(1),
});
