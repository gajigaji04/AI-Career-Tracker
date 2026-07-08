import { z } from "zod";
export declare const createStudySchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    category: z.ZodString;
    studyTime: z.ZodNumber;
    studyDate: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=study.validation.d.ts.map