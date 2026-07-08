"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_service_1 = require("../services/auth.service");
// ─── 1. 모듈 Mock 선언 ────────────────────────────────────────────────────────
// vi.mock()은 파일 최상단에 위치해야 함 (hoisting 때문)
// prisma 실제 DB 연결 대신 가짜 객체로 대체
vitest_1.vi.mock("../prisma/prisma", () => ({
    prisma: {
        user: {
            findUnique: vitest_1.vi.fn(),
            create: vitest_1.vi.fn(),
        },
    },
}));
vitest_1.vi.mock("bcrypt");
vitest_1.vi.mock("jsonwebtoken");
// ─── 2. Mock된 모듈 가져오기 ──────────────────────────────────────────────────
// vi.mocked()로 감싸면 TypeScript가 mock 메서드(.mockResolvedValue 등)를 인식함
const prisma_1 = require("../prisma/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockPrismaUser = vitest_1.vi.mocked(prisma_1.prisma.user);
const mockBcrypt = vitest_1.vi.mocked(bcrypt_1.default);
const mockJwt = vitest_1.vi.mocked(jsonwebtoken_1.default);
// ─── 테스트에서 재사용할 더미 데이터 ─────────────────────────────────────────
const fakeUser = {
    id: "user-id-123",
    email: "test@example.com",
    name: "테스터",
    password: "hashed_password",
};
// ─── 3. describe: 테스트 그룹 ─────────────────────────────────────────────────
(0, vitest_1.describe)("AuthService", () => {
    // 각 테스트 실행 전 mock 상태 초기화 (테스트 간 간섭 방지)
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ── register() ──────────────────────────────────────────────────────────────
    (0, vitest_1.describe)("register()", () => {
        const registerDto = {
            email: "test@example.com",
            password: "password123",
            name: "테스터",
        };
        (0, vitest_1.it)("새 유저를 생성하고 반환해야 한다", async () => {
            // Arrange: mock 반환값 설정
            // findUnique → null (이미 존재하는 유저 없음)
            mockPrismaUser.findUnique.mockResolvedValue(null);
            // bcrypt.hash → 가짜 해시값
            mockBcrypt.hash.mockResolvedValue("hashed_password");
            // prisma.user.create → 생성된 유저 반환
            mockPrismaUser.create.mockResolvedValue({
                id: fakeUser.id,
                email: fakeUser.email,
                name: fakeUser.name,
            });
            // Act: 실제 함수 호출
            const result = await (0, auth_service_1.register)(registerDto);
            // Assert: 결과 검증
            (0, vitest_1.expect)(result).toEqual({
                id: fakeUser.id,
                email: fakeUser.email,
                name: fakeUser.name,
            });
            // bcrypt.hash가 올바른 인자로 호출됐는지 확인
            (0, vitest_1.expect)(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
            // prisma.user.create가 해시된 비밀번호로 호출됐는지 확인
            (0, vitest_1.expect)(mockPrismaUser.create).toHaveBeenCalledWith({
                data: {
                    email: registerDto.email,
                    password: "hashed_password",
                    name: registerDto.name,
                },
                select: { id: true, email: true, name: true },
            });
        });
        (0, vitest_1.it)("이미 존재하는 이메일이면 에러를 던져야 한다", async () => {
            // Arrange: 이미 유저가 존재하는 상황
            mockPrismaUser.findUnique.mockResolvedValue(fakeUser);
            // Assert: 에러가 던져지는지 확인
            await (0, vitest_1.expect)((0, auth_service_1.register)(registerDto)).rejects.toThrow("이미 사용 중인 이메일입니다.");
            // 에러가 발생했으므로 create는 호출되지 않아야 함
            (0, vitest_1.expect)(mockPrismaUser.create).not.toHaveBeenCalled();
        });
    });
    // ── login() ─────────────────────────────────────────────────────────────────
    (0, vitest_1.describe)("login()", () => {
        (0, vitest_1.it)("올바른 이메일/비밀번호로 토큰과 유저 정보를 반환해야 한다", async () => {
            // Arrange
            mockPrismaUser.findUnique.mockResolvedValue(fakeUser);
            mockBcrypt.compare.mockResolvedValue(true);
            mockJwt.sign.mockReturnValue("fake.jwt.token");
            // Act
            const result = await (0, auth_service_1.login)("test@example.com", "password123");
            // Assert
            (0, vitest_1.expect)(result).toEqual({
                token: "fake.jwt.token",
                user: {
                    id: fakeUser.id,
                    email: fakeUser.email,
                    name: fakeUser.name,
                },
            });
            (0, vitest_1.expect)(mockBcrypt.compare).toHaveBeenCalledWith("password123", fakeUser.password);
        });
        (0, vitest_1.it)("존재하지 않는 이메일이면 404 에러를 던져야 한다", async () => {
            mockPrismaUser.findUnique.mockResolvedValue(null);
            await (0, vitest_1.expect)((0, auth_service_1.login)("wrong@example.com", "password123")).rejects.toThrow("사용자를 찾을 수 없습니다.");
        });
        (0, vitest_1.it)("비밀번호가 틀리면 401 에러를 던져야 한다", async () => {
            mockPrismaUser.findUnique.mockResolvedValue(fakeUser);
            mockBcrypt.compare.mockResolvedValue(false);
            await (0, vitest_1.expect)((0, auth_service_1.login)("test@example.com", "wrongpassword")).rejects.toThrow("비밀번호가 일치하지 않습니다.");
            // 비밀번호 틀렸으므로 jwt.sign은 호출되지 않아야 함
            (0, vitest_1.expect)(mockJwt.sign).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=auth.service.test.js.map