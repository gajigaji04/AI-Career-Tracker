"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// ─── 1. Mock 선언 (최상단 필수 — vi.mock은 hoisting됨) ───────────────────────
vitest_1.vi.mock("../prisma/prisma", () => ({
    prisma: {
        study: {
            create: vitest_1.vi.fn(),
            findMany: vitest_1.vi.fn(),
            findFirst: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
            delete: vitest_1.vi.fn(),
        },
    },
}));
// ─── 2. mock 모듈 및 테스트 대상 import ──────────────────────────────────────
const prisma_1 = require("../prisma/prisma");
const study_service_1 = require("../services/study.service");
const mockStudy = vitest_1.vi.mocked(prisma_1.prisma.study);
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
(0, vitest_1.describe)("StudyService", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ── createStudy() ──────────────────────────────────────────────────────────
    (0, vitest_1.describe)("createStudy()", () => {
        (0, vitest_1.it)("학습 기록을 생성하고 반환해야 한다", async () => {
            mockStudy.create.mockResolvedValue(fakeStudy);
            const result = await (0, study_service_1.createStudy)(USER_ID, createDto);
            (0, vitest_1.expect)(result).toEqual(fakeStudy);
            // studyDate string → Date 변환 확인
            (0, vitest_1.expect)(mockStudy.create).toHaveBeenCalledWith({
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
    (0, vitest_1.describe)("getStudies()", () => {
        (0, vitest_1.it)("해당 유저의 학습 기록 목록을 최신순으로 반환해야 한다", async () => {
            const fakeList = [fakeStudy];
            mockStudy.findMany.mockResolvedValue(fakeList);
            const result = await (0, study_service_1.getStudies)(USER_ID);
            (0, vitest_1.expect)(result).toEqual(fakeList);
            (0, vitest_1.expect)(mockStudy.findMany).toHaveBeenCalledWith({
                where: { userId: USER_ID },
                orderBy: { createdAt: "desc" },
            });
        });
        (0, vitest_1.it)("학습 기록이 없으면 빈 배열을 반환해야 한다", async () => {
            mockStudy.findMany.mockResolvedValue([]);
            const result = await (0, study_service_1.getStudies)(USER_ID);
            (0, vitest_1.expect)(result).toEqual([]);
        });
    });
    // ── getStudyById() ─────────────────────────────────────────────────────────
    (0, vitest_1.describe)("getStudyById()", () => {
        (0, vitest_1.it)("존재하는 학습 기록을 반환해야 한다", async () => {
            mockStudy.findFirst.mockResolvedValue(fakeStudy);
            const result = await (0, study_service_1.getStudyById)(STUDY_ID, USER_ID);
            (0, vitest_1.expect)(result).toEqual(fakeStudy);
            (0, vitest_1.expect)(mockStudy.findFirst).toHaveBeenCalledWith({
                where: { id: STUDY_ID, userId: USER_ID },
            });
        });
        (0, vitest_1.it)("존재하지 않는 id면 404 에러를 던져야 한다", async () => {
            mockStudy.findFirst.mockResolvedValue(null);
            await (0, vitest_1.expect)((0, study_service_1.getStudyById)("not-exist-id", USER_ID)).rejects.toThrow("학습 기록을 찾을 수 없습니다.");
        });
    });
    // ── updateStudy() ──────────────────────────────────────────────────────────
    (0, vitest_1.describe)("updateStudy()", () => {
        const updateData = { title: "수정된 제목", studyTime: 3 };
        const updatedStudy = { ...fakeStudy, ...updateData };
        (0, vitest_1.it)("학습 기록을 수정하고 반환해야 한다", async () => {
            // updateStudy 내부에서 getStudyById → findFirst 먼저 호출됨
            mockStudy.findFirst.mockResolvedValue(fakeStudy);
            mockStudy.update.mockResolvedValue(updatedStudy);
            const result = await (0, study_service_1.updateStudy)(STUDY_ID, USER_ID, updateData);
            (0, vitest_1.expect)(result).toEqual(updatedStudy);
            (0, vitest_1.expect)(mockStudy.update).toHaveBeenCalledWith({
                where: { id: STUDY_ID },
                data: updateData,
            });
        });
        (0, vitest_1.it)("존재하지 않는 학습 기록이면 404 에러를 던지고 update는 호출하지 않아야 한다", async () => {
            mockStudy.findFirst.mockResolvedValue(null);
            await (0, vitest_1.expect)((0, study_service_1.updateStudy)("not-exist-id", USER_ID, updateData)).rejects.toThrow("학습 기록을 찾을 수 없습니다.");
            (0, vitest_1.expect)(mockStudy.update).not.toHaveBeenCalled();
        });
    });
    // ── deleteStudy() ──────────────────────────────────────────────────────────
    (0, vitest_1.describe)("deleteStudy()", () => {
        (0, vitest_1.it)("학습 기록을 삭제해야 한다", async () => {
            // deleteStudy 내부에서 getStudyById → findFirst 먼저 호출됨
            mockStudy.findFirst.mockResolvedValue(fakeStudy);
            mockStudy.delete.mockResolvedValue(fakeStudy);
            await (0, study_service_1.deleteStudy)(STUDY_ID, USER_ID);
            (0, vitest_1.expect)(mockStudy.delete).toHaveBeenCalledWith({
                where: { id: STUDY_ID },
            });
        });
        (0, vitest_1.it)("존재하지 않는 학습 기록이면 404 에러를 던지고 delete는 호출하지 않아야 한다", async () => {
            mockStudy.findFirst.mockResolvedValue(null);
            await (0, vitest_1.expect)((0, study_service_1.deleteStudy)("not-exist-id", USER_ID)).rejects.toThrow("학습 기록을 찾을 수 없습니다.");
            (0, vitest_1.expect)(mockStudy.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=study.service.test.js.map