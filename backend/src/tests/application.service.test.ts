import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../prisma/prisma", () => ({
  prisma: {
    application: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// ─── 2. mock 모듈 및 테스트 대상 import ──────────────────────────────────────
import { prisma } from "../prisma/prisma";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../services/application.service";

const mockApplication = vi.mocked(prisma.application);

// ─── 공통 더미 데이터 ─────────────────────────────────────────────────────────
const USER_ID = "user-id-123";
const APPLICATION_ID = "application-id-456";
const NOW = new Date("2026-07-01T00:00:00.000Z");

const fakeApplication = {
  id: APPLICATION_ID,
  userId: USER_ID,
  companyName: "네이버",
  position: "백엔드 개발자",
  status: "APPLIED",
  appliedAt: new Date("2026-06-30"),
  memo: "1차 서류 제출",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createDto = {
  companyName: "네이버",
  position: "백엔드 개발자",
  status: "APPLIED" as const,
  appliedAt: "2026-06-30",
  memo: "1차 서류 제출",
};

// ─── 테스트 ───────────────────────────────────────────────────────────────────
describe("ApplicationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── createApplication() ────────────────────────────────────────────────────
  describe("createApplication()", () => {
    it("지원 내역을 생성하고 반환해야 한다", async () => {
      mockApplication.create.mockResolvedValue(fakeApplication as never);

      const result = await createApplication(USER_ID, createDto);

      expect(result).toEqual(fakeApplication);
      expect(mockApplication.create).toHaveBeenCalledWith({
        data: {
          companyName: createDto.companyName,
          position: createDto.position,
          status: createDto.status,
          appliedAt: new Date(createDto.appliedAt),
          memo: createDto.memo,
          userId: USER_ID,
        },
      });
    });

    it("appliedAt이 없으면 현재 시각으로 저장해야 한다", async () => {
      mockApplication.create.mockResolvedValue(fakeApplication as never);

      await createApplication(USER_ID, {
        companyName: createDto.companyName,
        position: createDto.position,
        status: createDto.status,
      });

      expect(mockApplication.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ appliedAt: NOW }),
      });
    });

    it("memo가 없으면 null로 저장해야 한다", async () => {
      mockApplication.create.mockResolvedValue(fakeApplication as never);

      await createApplication(USER_ID, {
        companyName: createDto.companyName,
        position: createDto.position,
        status: createDto.status,
      });

      expect(mockApplication.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ memo: null }),
      });
    });
  });

  // ── getApplications() ──────────────────────────────────────────────────────
  describe("getApplications()", () => {
    it("해당 유저의 지원 내역을 지원일 최신순으로 반환해야 한다", async () => {
      const fakeList = [fakeApplication];
      mockApplication.findMany.mockResolvedValue(fakeList as never);

      const result = await getApplications(USER_ID);

      expect(result).toEqual(fakeList);
      expect(mockApplication.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        orderBy: { appliedAt: "desc" },
      });
    });

    it("지원 내역이 없으면 빈 배열을 반환해야 한다", async () => {
      mockApplication.findMany.mockResolvedValue([] as never);

      const result = await getApplications(USER_ID);

      expect(result).toEqual([]);
    });
  });

  // ── getApplicationById() ───────────────────────────────────────────────────
  describe("getApplicationById()", () => {
    it("존재하는 지원 내역을 반환해야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);

      const result = await getApplicationById(APPLICATION_ID, USER_ID);

      expect(result).toEqual(fakeApplication);
      expect(mockApplication.findFirst).toHaveBeenCalledWith({
        where: { id: APPLICATION_ID, userId: USER_ID },
      });
    });

    it("존재하지 않는 id면 404 에러를 던져야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(null);

      await expect(
        getApplicationById("not-exist-id", USER_ID),
      ).rejects.toThrow("지원 내역을 찾을 수 없습니다.");
    });
  });

  // ── updateApplication() ────────────────────────────────────────────────────
  describe("updateApplication()", () => {
    const updateData = { status: "INTERVIEW" as const, memo: "면접 일정 확정" };
    const updatedApplication = { ...fakeApplication, ...updateData };

    it("지원 내역을 수정하고 반환해야 한다", async () => {
      // updateApplication 내부에서 getApplicationById → findFirst 먼저 호출됨
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);
      mockApplication.update.mockResolvedValue(updatedApplication as never);

      const result = await updateApplication(
        APPLICATION_ID,
        USER_ID,
        updateData,
      );

      expect(result).toEqual(updatedApplication);
      expect(mockApplication.update).toHaveBeenCalledWith({
        where: { id: APPLICATION_ID },
        data: updateData,
      });
    });

    it("존재하지 않는 지원 내역이면 404 에러를 던지고 update는 호출하지 않아야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(null);

      await expect(
        updateApplication("not-exist-id", USER_ID, updateData),
      ).rejects.toThrow("지원 내역을 찾을 수 없습니다.");

      expect(mockApplication.update).not.toHaveBeenCalled();
    });
  });

  // ── deleteApplication() ────────────────────────────────────────────────────
  describe("deleteApplication()", () => {
    it("지원 내역을 삭제해야 한다", async () => {
      // deleteApplication 내부에서 getApplicationById → findFirst 먼저 호출됨
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);
      mockApplication.delete.mockResolvedValue(fakeApplication as never);

      await deleteApplication(APPLICATION_ID, USER_ID);

      expect(mockApplication.delete).toHaveBeenCalledWith({
        where: { id: APPLICATION_ID },
      });
    });

    it("존재하지 않는 지원 내역이면 404 에러를 던지고 delete는 호출하지 않아야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(null);

      await expect(
        deleteApplication("not-exist-id", USER_ID),
      ).rejects.toThrow("지원 내역을 찾을 수 없습니다.");

      expect(mockApplication.delete).not.toHaveBeenCalled();
    });
  });
});
