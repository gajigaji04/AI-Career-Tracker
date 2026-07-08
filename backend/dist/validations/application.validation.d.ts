import { z } from "zod";
export declare const createApplicationSchema: z.ZodObject<{
    companyName: z.ZodString;
    position: z.ZodString;
    status: z.ZodEnum<{
        APPLIED: "APPLIED";
        DOCUMENT_PASS: "DOCUMENT_PASS";
        INTERVIEW: "INTERVIEW";
        FINAL_PASS: "FINAL_PASS";
        REJECTED: "REJECTED";
    }>;
    appliedAt: z.ZodOptional<z.ZodString>;
    memo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateApplicationSchema: z.ZodObject<{
    companyName: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        APPLIED: "APPLIED";
        DOCUMENT_PASS: "DOCUMENT_PASS";
        INTERVIEW: "INTERVIEW";
        FINAL_PASS: "FINAL_PASS";
        REJECTED: "REJECTED";
    }>>;
    memo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=application.validation.d.ts.map