import { z } from "zod";
export declare const createProjectSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    githubUrl: z.ZodOptional<z.ZodString>;
    deployUrl: z.ZodOptional<z.ZodString>;
    techStack: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=project.validation.d.ts.map