interface RegisterDto {
    email: string;
    password: string;
    name: string;
}
export declare const register: ({ email, password, name }: RegisterDto) => Promise<{
    email: string;
    name: string;
    id: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}>;
export declare const refreshAccessToken: (refreshToken: string) => {
    accessToken: string;
};
export declare const getMe: (userId: string) => Promise<{
    email: string;
    name: string;
    id: string;
    createdAt: Date;
} | null>;
export {};
//# sourceMappingURL=auth.service.d.ts.map