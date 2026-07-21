interface CreateStudyDto {
    title: string;
    content: string;
    category: string;
    studyTime: number;
    studyDate: string;
}
export declare const createStudy: (userId: string, data: CreateStudyDto) => Promise<any>;
export declare const getStudies: (userId: string) => Promise<any>;
export declare const getStudyById: (id: string, userId: string) => Promise<any>;
export declare const updateStudy: (id: string, userId: string, data: {
    title?: string;
    content?: string;
    category?: string;
    studyTime?: number;
}) => Promise<any>;
export declare const deleteStudy: (id: string, userId: string) => Promise<void>;
export {};
//# sourceMappingURL=study.service.d.ts.map