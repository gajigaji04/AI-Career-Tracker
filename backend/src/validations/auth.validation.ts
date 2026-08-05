import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  nickname: z.string().min(1),

  jobTitle: z.string().optional(),
  experienceLevel: z
    .enum(["STUDENT", "JOB_SEEKER", "NEW_DEVELOPER", "JUNIOR_DEVELOPER", "EXPERIENCED_DEVELOPER"])
    .optional(),
  interestedStack: z.array(z.string()).optional(),
});
