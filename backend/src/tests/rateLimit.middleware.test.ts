import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { authLimiter } from "../middlewares/rateLimit.middleware";

// app.integration.test.ts 는 라우트 체인 검증을 위해 limiter 를 통과시키므로,
// 인증 API rate limit(15분 / 10회) 자체는 여기서 독립적으로 검증한다.
describe("authLimiter", () => {
  it("같은 IP에서 10회까지는 통과하고 11번째 요청은 429를 반환한다", async () => {
    const app = express();
    app.post("/login", authLimiter, (_req, res) => {
      res.status(200).json({ success: true });
    });

    for (let i = 0; i < 10; i++) {
      const res = await request(app).post("/login");
      expect(res.status).toBe(200);
    }

    const blocked = await request(app).post("/login");
    expect(blocked.status).toBe(429);
    expect(blocked.body.success).toBe(false);
  });
});
