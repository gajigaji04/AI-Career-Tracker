import { z } from "zod";

export const createApplicationSchema = z.object({
  companyName: z.string().min(1),
  position: z.string().min(1),
  status: z.enum([
    "APPLIED",
    "DOCUMENT_PASS",
    "INTERVIEW",
    "FINAL_PASS",
    "REJECTED",
  ]),
  appliedAt: z.string().optional(),
  memo: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  companyName: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  status: z
    .enum(["APPLIED", "DOCUMENT_PASS", "INTERVIEW", "FINAL_PASS", "REJECTED"])
    .optional(),
  memo: z.string().optional(),
});
