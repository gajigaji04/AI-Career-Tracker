export declare const uploadResume: (userId: string, file: Express.Multer.File) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    fileName: string;
    fileUrl: string;
    version: number;
}>;
export declare const getResumes: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    fileName: string;
    fileUrl: string;
    version: number;
}[]>;
export declare const deleteResume: (id: string, userId: string) => Promise<void>;
//# sourceMappingURL=resume.service.d.ts.map