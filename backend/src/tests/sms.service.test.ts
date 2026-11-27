import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../config/logger", () => ({ logger: { info: vi.fn(), error: vi.fn() } }));

import { logger } from "../config/logger";
import { sendSms } from "../services/sms.service";

const mockLoggerInfo = vi.mocked(logger.info);

describe("sendSms() — Solapi 미설정 시", () => {
  const original = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SOLAPI_API_KEY;
    delete process.env.SOLAPI_API_SECRET;
    delete process.env.SOLAPI_SENDER_NUMBER;
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("development 에서는 발송 대신 로그로 남긴다 (로컬 테스트용)", async () => {
    process.env.NODE_ENV = "development";

    await expect(sendSms("01012345678", "인증번호 123456")).resolves.toBeUndefined();
    expect(mockLoggerInfo).toHaveBeenCalledTimes(1);
  });

  it("production 에서는 인증번호를 로그에 남기지 않고 에러를 던진다", async () => {
    process.env.NODE_ENV = "production";

    await expect(sendSms("01012345678", "인증번호 123456")).rejects.toThrow();
    expect(mockLoggerInfo).not.toHaveBeenCalled();
  });

  it("NODE_ENV 가 없어도(설정 누락) 로그에 남기지 않는다", async () => {
    delete process.env.NODE_ENV;

    await expect(sendSms("01012345678", "인증번호 123456")).rejects.toThrow();
    expect(mockLoggerInfo).not.toHaveBeenCalled();
  });
});
