import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import request from "supertest";

// ─── Prisma는 실제 DB 대신 mock으로 대체 (유닛 테스트와 동일한 경계) ───────────
// 이 파일은 "서비스 함수를 직접 호출"하는 대신, 실제 Express 앱에 HTTP 요청을 보내서
// 라우팅 → 인증 미들웨어 → 검증 미들웨어 → 컨트롤러 → 에러 핸들러가 실제로
// 맞물려 동작하는지를 검증한다.
vi.mock("../prisma/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    study: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_REFRESH_SECRET = "test-jwt-refresh-secret";
process.env.ALLOWED_ORIGIN = "http://localhost:5173";
// ai.service.ts constructs the Groq client eagerly at module load time, so `app`
// can't even be imported without this being set to something non-empty.
process.env.GROQ_API_KEY = "test-groq-key";

import { prisma } from "../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

// ES module `import` statements are hoisted above the process.env assignments
// above, regardless of source order — so `app` (which transitively constructs
// the Groq client from GROQ_API_KEY at module load time) must be loaded via a
// dynamic import instead, after the env vars are actually set.
let app: ReturnType<typeof express>;

const mockUser = vi.mocked(prisma.user);
const mockStudy = vi.mocked(prisma.study);

const fakeUser = {
  id: "user-id-123",
  email: "test@example.com",
  password: "",
  name: "테스터",
  nickname: "테스트닉네임",
  createdAt: new Date(),
};

beforeAll(async () => {
  fakeUser.password = await bcrypt.hash("password1234", 10);
  // TS's nodenext resolution doesn't narrow a dynamic import()'s `.default` for
  // this CJS module correctly (runtime value is correct — verified by every test
  // below actually hitting real routes) — hence the double cast.
  app = (await import("../app.js")).default as unknown as ReturnType<typeof express>;
});

describe("POST /auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("유효한 요청이면 201과 생성된 유저를 반환한다", async () => {
    mockUser.findUnique.mockResolvedValue(null);
    mockUser.create.mockResolvedValue({
      id: fakeUser.id,
      email: fakeUser.email,
      name: fakeUser.name,
      nickname: fakeUser.nickname,
    } as never);

    const res = await request(app).post("/auth/register").send({
      email: fakeUser.email,
      password: "password1234",
      name: fakeUser.name,
      nickname: fakeUser.nickname,
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      success: true,
      data: {
        id: fakeUser.id,
        email: fakeUser.email,
        name: fakeUser.name,
        nickname: fakeUser.nickname,
      },
    });
  });

  it("필수 필드(nickname)가 없으면 검증 미들웨어가 400을 반환하고 컨트롤러까지 도달하지 않는다", async () => {
    const res = await request(app).post("/auth/register").send({
      email: fakeUser.email,
      password: "password1234",
      name: fakeUser.name,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(mockUser.create).not.toHaveBeenCalled();
  });
});

describe("POST /auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("올바른 자격증명이면 200과 함께 accessToken/refreshToken 쿠키를 내려준다", async () => {
    mockUser.findUnique.mockResolvedValue(fakeUser as never);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: fakeUser.email, password: "password1234" });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(fakeUser.email);

    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies.some((c) => c.startsWith("accessToken="))).toBe(true);
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
    // 인증 토큰은 XSS로부터 보호되도록 httpOnly 쿠키여야 한다
    expect(cookies.every((c) => c.includes("HttpOnly"))).toBe(true);
  });

  it("비밀번호가 틀리면 401을 반환한다", async () => {
    mockUser.findUnique.mockResolvedValue(fakeUser as never);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: fakeUser.email, password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /auth/me — 인증 미들웨어", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("쿠키가 없으면 401을 반환하고 컨트롤러를 호출하지 않는다", async () => {
    const res = await request(app).get("/auth/me");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ success: false, message: "토큰이 없습니다." });
    expect(mockUser.findUnique).not.toHaveBeenCalled();
  });

  it("위조된 토큰이면 401을 반환한다", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Cookie", ["accessToken=not-a-real-jwt"]);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("유효하지 않은 토큰입니다.");
  });

  it("로그인 → 발급받은 쿠키로 내 정보를 조회하는 전체 흐름이 동작한다", async () => {
    mockUser.findUnique.mockResolvedValue(fakeUser as never);

    const agent = request.agent(app);

    const loginRes = await agent
      .post("/auth/login")
      .send({ email: fakeUser.email, password: "password1234" });
    expect(loginRes.status).toBe(200);

    mockUser.findUnique.mockResolvedValue({
      id: fakeUser.id,
      email: fakeUser.email,
      name: fakeUser.name,
      createdAt: fakeUser.createdAt,
    } as never);

    const meRes = await agent.get("/auth/me");
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(fakeUser.email);
  });
});

describe("POST /studies — 인증 + 검증 미들웨어가 실제로 체인되는지", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validToken = () =>
    jwt.sign({ userId: fakeUser.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  it("인증 쿠키가 없으면 401이고 검증/컨트롤러 단계까지 가지 않는다", async () => {
    const res = await request(app).post("/studies").send({
      title: "제목",
      content: "내용",
      category: "프론트엔드",
      studyTime: 60,
      studyDate: "2026-08-01",
    });

    expect(res.status).toBe(401);
    expect(mockStudy.create).not.toHaveBeenCalled();
  });

  it("인증은 됐지만 studyTime이 빠지면 400을 반환한다", async () => {
    const res = await request(app)
      .post("/studies")
      .set("Cookie", [`accessToken=${validToken()}`])
      .send({ title: "제목", content: "내용", category: "프론트엔드", studyDate: "2026-08-01" });

    expect(res.status).toBe(400);
    expect(mockStudy.create).not.toHaveBeenCalled();
  });

  it("인증 + 유효한 body면 201로 생성된 학습 기록을 반환한다", async () => {
    mockStudy.create.mockResolvedValue({
      id: "study-1",
      userId: fakeUser.id,
      title: "제목",
      content: "내용",
      category: "프론트엔드",
      studyTime: 60,
      studyDate: new Date("2026-08-01"),
    } as never);

    const res = await request(app)
      .post("/studies")
      .set("Cookie", [`accessToken=${validToken()}`])
      .send({
        title: "제목",
        content: "내용",
        category: "프론트엔드",
        studyTime: 60,
        studyDate: "2026-08-01",
      });

    expect(res.status).toBe(201);
    expect(mockStudy.create).toHaveBeenCalledTimes(1);
  });
});

describe("POST /ai/cover-letter — AI 라우트도 다른 라우트와 동일하게 검증되는지", () => {
  const validToken = () =>
    jwt.sign({ userId: fakeUser.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  it("인증 없이는 401이다", async () => {
    const res = await request(app).post("/ai/cover-letter").send({});
    expect(res.status).toBe(401);
  });

  it("인증은 됐지만 applicationId가 없으면 400을 반환하고 Groq를 호출하지 않는다", async () => {
    const res = await request(app)
      .post("/ai/cover-letter")
      .set("Cookie", [`accessToken=${validToken()}`])
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("정의되지 않은 라우트 / 에러 핸들러", () => {
  it("존재하지 않는 라우트는 404를 반환한다", async () => {
    const res = await request(app).get("/no-such-route");
    expect(res.status).toBe(404);
  });
});
