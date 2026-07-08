interface CreateApplicationDto {
    companyName: string;
    position: string;
    status: "APPLIED" | "DOCUMENT_PASS" | "INTERVIEW" | "FINAL_PASS" | "REJECTED";
    appliedAt?: string;
    memo?: string;
}
export declare const createApplication: (userId: string, data: CreateApplicationDto) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    companyName: string;
    position: string;
    status: import("@prisma/client").$Enums.ApplicationStatus;
    appliedAt: Date;
    memo: string | null;
}>;
export declare const getApplications: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    companyName: string;
    position: string;
    status: import("@prisma/client").$Enums.ApplicationStatus;
    appliedAt: Date;
    memo: string | null;
}[]>;
export declare const getApplicationById: (id: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    companyName: string;
    position: string;
    status: import("@prisma/client").$Enums.ApplicationStatus;
    appliedAt: Date;
    memo: string | null;
}>;
export declare const updateApplication: (id: string, userId: string, data: {
    companyName?: string;
    position?: string;
    status?: "APPLIED" | "DOCUMENT_PASS" | "INTERVIEW" | "FINAL_PASS" | "REJECTED";
    memo?: string;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    companyName: string;
    position: string;
    status: import("@prisma/client").$Enums.ApplicationStatus;
    appliedAt: Date;
    memo: string | null;
}>;
export declare const deleteApplication: (id: string, userId: string) => Promise<void>;
export {};
//# sourceMappingURL=application.service.d.ts.map