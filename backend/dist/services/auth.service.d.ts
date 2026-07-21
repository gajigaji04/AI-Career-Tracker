interface RegisterDto {
    email: string;
    password: string;
    name: string;
}
export declare const register: ({ email, password, name }: RegisterDto) => Promise<any>;
export declare const login: (email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: any;
        email: any;
        name: any;
    };
}>;
export declare const refreshAccessToken: (refreshToken: string) => {
    accessToken: string;
};
export declare const getMe: (userId: string) => Promise<any>;
export {};
//# sourceMappingURL=auth.service.d.ts.map