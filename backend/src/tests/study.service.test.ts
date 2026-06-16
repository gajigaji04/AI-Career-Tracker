import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── 1. Mock 선언 (최상단 필수 — vi.mock은 hoisting됨) ───────────────────────
vi.mock("../prisma/prisma", () => ({
  prisma: {
    study: {
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
  createStudy,
  getStudies,
  getStudyById,
  updateStudy,
  deleteStudy,
} from "../services/study.service";

const mockStudy = vi.mocked(prisma.study);

// ─── 공통 더미 데이터 ─────────────────────────────────────────────────────────
const USER_ID = "user-id-123";
const STUDY_ID = "study-id-456";

const fakeStudy = {
  id: STUDY_ID,
  userId: USER_ID,
  title: "TypeScript 기초",
  content: "제네릭, 타입 가드 학습",
  category: "Frontend",
  studyTime: 2,
  studyDate: new Date("2026-06-16"),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createDto = {
  title: "TypeScript 기초",
  content: "제네릭, 타입 가드 학습",
  category: "Frontend",
  studyTime: 2,
  studyDate: "2026-06-16",
};

// ─── 테스트 ───────────────────────────────────────────────────────────────────
describe("StudyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── createStudy() ──────────────────────────────────────────────────────────
  describe("createStudy()", () => {
    it("학습 기록을 생성하고 반환해야 한다", async () => {
      mockStudy.create.mockResolvedValue(fakeStudy as never);

      const result = await createStudy(USER_ID, createDto);

      expect(result).toEqual(fakeStudy);
      // studyDate string → Date 변환 확인
      expect(mockStudy.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          content: createDto.content,
          category: createDto.category,
          studyTime: createDto.studyTime,
          studyDate: new Date(createDto.studyDate),
          userId: USER_ID,
        },
      });
    });
  });

  // ── getStudies() ───────────────────────────────────────────────────────────
  describe("getStudies()", () => {
    it("해당 유저의 학습 기록 목록을 최신순으로 반환해야 한다", async () => {
      const fakeList = [fakeStudy];
      mockStudy.findMany.mockResolvedValue(fakeList as never);

      const result = await getStudies(USER_ID);

      expect(result).toEqual(fakeList);
      expect(mockStudy.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        orderBy: { createdAt: "desc" },
      });
    });

    it("학습 기록이 없으면 빈 배열을 반환해야 한다", async () => {
      mockStudy.findMany.mockResolvedValue([] as never);

      const result = await getStudies(USER_ID);

      expect(result).toEqual([]);
    });
  });

  // ── getStudyById() ─────────────────────────────────────────────────────────
  describe("getStudyById()", () => {
    it("존재하는 학습 기록을 반환해야 한다", async () => {
      mockStudy.findFirst.mockResolvedValue(fakeStudy as never);

      const result = await getStudyById(STUDY_ID, USER_ID);

      expect(result).toEqual(fakeStudy);
      expect(mockStudy.findFirst).toHaveBeenCalledWith({
        where: { id: STUDY_ID, userId: USER_ID },
      });
    });

    it("존재하지 않는 id면 404 에러를 던져야 한다", async () => {
      mockStudy.findFirst.mockResolvedValue(null);

      await expect(getStudyById("not-exist-id", USER_ID)).rejects.toThrow(
        "학습 기록을 찾을 수 없습니다.",
      );
    });
  });

  // ── updateStudy() ──────────────────────────────────────────────────────────
  describe("updateStudy()", () => {
    const updateData = { title: "수정된 제목", studyTime: 3 };
    const updatedStudy = { ...fakeStudy, ...updateData };

    it("학습 기록을 수정하고 반환해야 한다", async () => {
      // updateStudy 내부에서 getStudyById → findFirst 먼저 호출됨
      mockStudy.findFirst.mockResolvedValue(fakeStudy as never);
      mockStudy.update.mockResolvedValue(updatedStudy as never);

      const result = await updateStudy(STUDY_ID, USER_ID, updateData);

      expect(result).toEqual(updatedStudy);
      expect(mockStudy.update).toHaveBeenCalledWith({
        where: { id: STUDY_ID },
        data: updateData,
      });
    });

    it("존재하지 않는 학습 기록이면 404 에러를 던지고 update는 호출하지 않아야 한다", async () => {
      mockStudy.findFirst.mockResolvedValue(null);

      await expect(
        updateStudy("not-exist-id", USER_ID, updateData),
      ).rejects.toThrow("학습 기록을 찾을 수 없습니다.");

      expect(mockStudy.update).not.toHaveBeenCalled();
    });
  });

  // ── deleteStudy() ──────────────────────────────────────────────────────────
  describe("deleteStudy()", () => {
    it("학습 기록을 삭제해야 한다", async () => {
      // deleteStudy 내부에서 getStudyById → findFirst 먼저 호출됨
      mockStudy.findFirst.mockResolvedValue(fakeStudy as never);
      mockStudy.delete.mockResolvedValue(fakeStudy as never);

      await deleteStudy(STUDY_ID, USER_ID);

      expect(mockStudy.delete).toHaveBeenCalledWith({
        where: { id: STUDY_ID },
      });
    });

    it("존재하지 않는 학습 기록이면 404 에러를 던지고 delete는 호출하지 않아야 한다", async () => {
      mockStudy.findFirst.mockResolvedValue(null);

      await expect(deleteStudy("not-exist-id", USER_ID)).rejects.toThrow(
        "학습 기록을 찾을 수 없습니다.",
      );

      expect(mockStudy.delete).not.toHaveBeenCalled();
    });
  });
});
