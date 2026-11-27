import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../prisma/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("../services/sms.service", () => ({ sendSms: vi.fn() }));

import { prisma } from "../prisma/prisma";
import { sendSms } from "../services/sms.service";
import {
  requestFindEmail,
  verifyFindEmail,
  MAX_PHONE_CODE_ATTEMPTS,
} from "../services/auth.service";

const mockUser = vi.mocked(prisma.user);
const mockSendSms = vi.mocked(sendSms);

const PHONE = "01012345678";
const CODE = "123456";
const INVALID = { message: "인증번호가 올바르지 않거나 만료되었습니다.", statusCode: 400 };

const userWithCode = (overrides: Record<string, unknown> = {}) => ({
  id: "user-1",
  email: "test@example.com",
  phone: PHONE,
  phoneVerificationCode: CODE,
  phoneVerificationCodeExpiresAt: new Date(Date.now() + 60_000),
  phoneVerificationAttempts: 0,
  ...overrides,
});

const CLEARED = {
  phoneVerificationCode: null,
  phoneVerificationCodeExpiresAt: null,
  phoneVerificationAttempts: 0,
};

describe("requestFindEmail()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("새 인증번호를 발급하면 시도 횟수를 0으로 초기화한다", async () => {
    mockUser.findUnique.mockResolvedValue(userWithCode({ phoneVerificationAttempts: 5 }) as never);

    await requestFindEmail(PHONE);

    expect(mockUser.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: expect.objectContaining({ phoneVerificationAttempts: 0 }),
    });
    expect(mockSendSms).toHaveBeenCalledTimes(1);
  });

  it("SMS 발송이 실패해도 응답은 동일하게 끝난다 (번호 등록 여부 비노출)", async () => {
    mockUser.findUnique.mockResolvedValue(userWithCode() as never);
    mockSendSms.mockRejectedValue(new Error("sms down"));

    await expect(requestFindEmail(PHONE)).resolves.toBeUndefined();
  });
});

describe("verifyFindEmail()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("올바른 코드면 이메일을 반환하고 코드·시도 횟수를 초기화한다", async () => {
    mockUser.findUnique.mockResolvedValue(userWithCode() as never);
    mockUser.updateMany.mockResolvedValue({ count: 1 } as never);

    await expect(verifyFindEmail(PHONE, CODE)).resolves.toEqual({ email: "test@example.com" });
    expect(mockUser.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: CLEARED });
  });

  it("비교 전에 시도 횟수를 조건부(lt: MAX)로 원자적으로 증가시킨다", async () => {
    mockUser.findUnique.mockResolvedValue(userWithCode() as never);
    mockUser.updateMany.mockResolvedValue({ count: 1 } as never);

    await verifyFindEmail(PHONE, CODE);

    expect(mockUser.updateMany).toHaveBeenCalledWith({
      where: {
        id: "user-1",
        phoneVerificationCode: CODE,
        phoneVerificationAttempts: { lt: MAX_PHONE_CODE_ATTEMPTS },
      },
      data: { phoneVerificationAttempts: { increment: 1 } },
    });
  });

  it("코드가 틀리면 400, 아직 횟수가 남았으면 코드를 유지한다", async () => {
    mockUser.findUnique.mockResolvedValue(userWithCode({ phoneVerificationAttempts: 1 }) as never);
    mockUser.updateMany.mockResolvedValue({ count: 1 } as never);

    await expect(verifyFindEmail(PHONE, "000000")).rejects.toMatchObject(INVALID);
    expect(mockUser.update).not.toHaveBeenCalled();
  });

  it(`${MAX_PHONE_CODE_ATTEMPTS}번째 시도도 틀리면 코드를 폐기한다`, async () => {
    mockUser.findUnique.mockResolvedValue(
      userWithCode({ phoneVerificationAttempts: MAX_PHONE_CODE_ATTEMPTS - 1 }) as never,
    );
    mockUser.updateMany.mockResolvedValue({ count: 1 } as never);

    await expect(verifyFindEmail(PHONE, "000000")).rejects.toMatchObject(INVALID);
    expect(mockUser.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: CLEARED });
  });

  it("시도 횟수를 다 쓴 뒤에는 올바른 코드여도 같은 400으로 거부하고 코드를 폐기한다", async () => {
    mockUser.findUnique.mockResolvedValue(
      userWithCode({ phoneVerificationAttempts: MAX_PHONE_CODE_ATTEMPTS }) as never,
    );
    // 조건(lt: MAX)을 만족하지 못해 차감 실패
    mockUser.updateMany.mockResolvedValue({ count: 0 } as never);

    await expect(verifyFindEmail(PHONE, CODE)).rejects.toMatchObject(INVALID);
    expect(mockUser.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: CLEARED });
  });

  it("만료된 코드는 시도 횟수 차감 없이 400을 던지고 코드를 폐기한다", async () => {
    mockUser.findUnique.mockResolvedValue(
      userWithCode({ phoneVerificationCodeExpiresAt: new Date(Date.now() - 1000) }) as never,
    );

    await expect(verifyFindEmail(PHONE, CODE)).rejects.toMatchObject(INVALID);
    expect(mockUser.updateMany).not.toHaveBeenCalled();
    expect(mockUser.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: CLEARED });
  });

  it("미등록 번호 / 발급된 코드 없음은 같은 400 응답이다", async () => {
    mockUser.findUnique.mockResolvedValueOnce(null);
    await expect(verifyFindEmail(PHONE, CODE)).rejects.toMatchObject(INVALID);

    mockUser.findUnique.mockResolvedValueOnce(
      userWithCode({ phoneVerificationCode: null, phoneVerificationCodeExpiresAt: null }) as never,
    );
    await expect(verifyFindEmail(PHONE, CODE)).rejects.toMatchObject(INVALID);

    expect(mockUser.updateMany).not.toHaveBeenCalled();
  });

  it("자릿수가 다른 코드도 예외 없이 400으로 처리한다", async () => {
    mockUser.findUnique.mockResolvedValue(userWithCode() as never);
    mockUser.updateMany.mockResolvedValue({ count: 1 } as never);

    await expect(verifyFindEmail(PHONE, "12")).rejects.toMatchObject(INVALID);
  });
});
