"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.refreshAccessToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma/prisma");
const AppError_1 = require("../errors/AppError");
const register = async ({ email, password, name }) => {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error("이미 사용 중인 이메일입니다.");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: { email, password: hashedPassword, name },
        select: { id: true, email: true, name: true },
    });
    return user;
};
exports.register = register;
const login = async (email, password) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError_1.AppError("사용자를 찾을 수 없습니다.", 404);
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new AppError_1.AppError("비밀번호가 일치하지 않습니다.", 401);
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
};
exports.login = login;
const refreshAccessToken = (refreshToken) => {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { accessToken: newAccessToken };
    }
    catch {
        throw new AppError_1.AppError("유효하지 않은 리프레시 토큰입니다.", 401);
    }
};
exports.refreshAccessToken = refreshAccessToken;
const getMe = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });
    return user;
};
exports.getMe = getMe;
//# sourceMappingURL=auth.service.js.map