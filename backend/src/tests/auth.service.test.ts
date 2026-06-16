import { describe, it, expect, vi, beforeEach } from "vitest";
import { register, login } from "../services/auth.service";

// ─── 1. 모듈 Mock 선언 ────────────────────────────────────────────────────────
// vi.mock()은 파일 최상단에 위치해야 함 (hoisting 때문)
// prisma 실제 DB 연결 대신 가짜 객체로 대체
vi.mock("../prisma/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcrypt");
vi.mock("jsonwebtoken");

// ─── 2. Mock된 모듈 가져오기 ──────────────────────────────────────────────────
// vi.mocked()로 감싸면 TypeScript가 mock 메서드(.mockResolvedValue 등)를 인식함
import { prisma } from "../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const mockPrismaUser = vi.mocked(prisma.user);
const mockBcrypt = vi.mocked(bcrypt);
const mockJwt = vi.mocked(jwt);

// ─── 테스트에서 재사용할 더미 데이터 ─────────────────────────────────────────
const fakeUser = {
  id: "user-id-123",
  email: "test@example.com",
  name: "테스터",
  password: "hashed_password",
};

// ─── 3. describe: 테스트 그룹 ─────────────────────────────────────────────────
describe("AuthService", () => {
  // 각 테스트 실행 전 mock 상태 초기화 (테스트 간 간섭 방지)
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── register() ──────────────────────────────────────────────────────────────
  describe("register()", () => {
    const registerDto = {
      email: "test@example.com",
      password: "password123",
      name: "테스터",
    };

    it("새 유저를 생성하고 반환해야 한다", async () => {
      // Arrange: mock 반환값 설정
      // findUnique → null (이미 존재하는 유저 없음)
      mockPrismaUser.findUnique.mockResolvedValue(null);
      // bcrypt.hash → 가짜 해시값
      mockBcrypt.hash.mockResolvedValue("hashed_password" as never);
      // prisma.user.create → 생성된 유저 반환
      mockPrismaUser.create.mockResolvedValue({
        id: fakeUser.id,
        email: fakeUser.email,
        name: fakeUser.name,
      } as never);

      // Act: 실제 함수 호출
      const result = await register(registerDto);

      // Assert: 결과 검증
      expect(result).toEqual({
        id: fakeUser.id,
        email: fakeUser.email,
        name: fakeUser.name,
      });

      // bcrypt.hash가 올바른 인자로 호출됐는지 확인
      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);

      // prisma.user.create가 해시된 비밀번호로 호출됐는지 확인
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: "hashed_password",
          name: registerDto.name,
        },
        select: { id: true, email: true, name: true },
      });
    });

    it("이미 존재하는 이메일이면 에러를 던져야 한다", async () => {
      // Arrange: 이미 유저가 존재하는 상황
      mockPrismaUser.findUnique.mockResolvedValue(fakeUser as never);

      // Assert: 에러가 던져지는지 확인
      await expect(register(registerDto)).rejects.toThrow(
        "이미 사용 중인 이메일입니다.",
      );

      // 에러가 발생했으므로 create는 호출되지 않아야 함
      expect(mockPrismaUser.create).not.toHaveBeenCalled();
    });
  });

  // ── login() ─────────────────────────────────────────────────────────────────
  describe("login()", () => {
    it("올바른 이메일/비밀번호로 토큰과 유저 정보를 반환해야 한다", async () => {
      // Arrange
      mockPrismaUser.findUnique.mockResolvedValue(fakeUser as never);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue("fake.jwt.token" as never);

      // Act
      const result = await login("test@example.com", "password123");

      // Assert
      expect(result).toEqual({
        token: "fake.jwt.token",
        user: {
          id: fakeUser.id,
          email: fakeUser.email,
          name: fakeUser.name,
        },
      });

      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "password123",
        fakeUser.password,
      );
    });

    it("존재하지 않는 이메일이면 404 에러를 던져야 한다", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(login("wrong@example.com", "password123")).rejects.toThrow(
        "사용자를 찾을 수 없습니다.",
      );
    });

    it("비밀번호가 틀리면 401 에러를 던져야 한다", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(fakeUser as never);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(login("test@example.com", "wrongpassword")).rejects.toThrow(
        "비밀번호가 일치하지 않습니다.",
      );

      // 비밀번호 틀렸으므로 jwt.sign은 호출되지 않아야 함
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });
  });
});
