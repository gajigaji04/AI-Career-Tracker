export declare const generateCoverLetter: (userId: string, applicationId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    content: string;
    type: import("@prisma/client").$Enums.AiAnalysisType;
    applicationId: string;
}>;
export declare const generateInterviewQuestions: (userId: string, applicationId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    content: string;
    type: import("@prisma/client").$Enums.AiAnalysisType;
    applicationId: string;
}>;
export declare const getAiAnalyses: (userId: string, applicationId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    content: string;
    type: import("@prisma/client").$Enums.AiAnalysisType;
    applicationId: string;
}[]>;
//# sourceMappingURL=ai.service.d.ts.map