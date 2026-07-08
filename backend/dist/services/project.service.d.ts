interface CreateProjectDto {
    title: string;
    description: string;
    githubUrl?: string;
    deployUrl?: string;
    techStack: string;
}
export declare const createProject: (userId: string, data: CreateProjectDto) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    description: string;
    githubUrl: string | null;
    deployUrl: string | null;
    techStack: string[];
}>;
export declare const getProjects: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    description: string;
    githubUrl: string | null;
    deployUrl: string | null;
    techStack: string[];
}[]>;
export declare const getProjectById: (id: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    description: string;
    githubUrl: string | null;
    deployUrl: string | null;
    techStack: string[];
}>;
export declare const updateProject: (id: string, userId: string, data: {
    title?: string;
    description?: string;
    githubUrl?: string;
    deployUrl?: string;
    techStack?: string;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    description: string;
    githubUrl: string | null;
    deployUrl: string | null;
    techStack: string[];
}>;
export declare const deleteProject: (id: string, userId: string) => Promise<void>;
export {};
//# sourceMappingURL=project.service.d.ts.map