import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }));

vi.mock("groq-sdk", () => ({
  default: vi.fn().mockImplementation(function MockGroq(this: unknown) {
    return { chat: { completions: { create: mockCreate } } };
  }),
}));

vi.mock("../prisma/prisma", () => ({
  prisma: {
    application: { findFirst: vi.fn() },
    user: { findUnique: vi.fn() },
    project: { findMany: vi.fn() },
    aiAnalysis: { create: vi.fn(), findMany: vi.fn() },
  },
}));

// ─── 2. mock 모듈 및 테스트 대상 import ──────────────────────────────────────
import { prisma } from "../prisma/prisma";
import {
  generateCoverLetter,
  generateInterviewQuestions,
  getAiAnalyses,
} from "../services/ai.service";

const mockApplication = vi.mocked(prisma.application);
const mockUser = vi.mocked(prisma.user);
const mockProject = vi.mocked(prisma.project);
const mockAiAnalysis = vi.mocked(prisma.aiAnalysis);

const MODEL = "llama-3.3-70b-versatile";

// ─── 공통 더미 데이터 ─────────────────────────────────────────────────────────
const USER_ID = "user-id-123";
const APPLICATION_ID = "application-id-456";

const fakeApplication = {
  id: APPLICATION_ID,
  userId: USER_ID,
  companyName: "카카오",
  position: "프론트엔드 개발자",
  status: "APPLIED",
  appliedAt: new Date(),
  memo: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const fakeUser = { name: "테스터" };

const fakeProjects = [
  { title: "AI CareerHub", description: "취업 관리 플랫폼", techStack: ["React", "Node.js"] },
  { title: "Todo App", description: "할일 관리 앱", techStack: ["React", "Vue"] },
];

const fakeAiAnalysis = {
  id: "analysis-id-789",
  type: "COVER_LETTER",
  content: "생성된 자기소개서 내용",
  applicationId: APPLICATION_ID,
  userId: USER_ID,
  createdAt: new Date(),
};

const fakeCompletion = (content: string) => ({
  choices: [{ message: { content } }],
});

// ─── 테스트 ───────────────────────────────────────────────────────────────────
describe("AiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── generateCoverLetter() ──────────────────────────────────────────────────
  describe("generateCoverLetter()", () => {
    it("지원 내역이 없으면 404 에러를 던지고 AI 호출은 하지 않아야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(null);

      await expect(
        generateCoverLetter(USER_ID, APPLICATION_ID),
      ).rejects.toThrow("지원 내역을 찾을 수 없습니다.");

      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockAiAnalysis.create).not.toHaveBeenCalled();
    });

    it("자기소개서를 생성하고 저장해야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);
      mockUser.findUnique.mockResolvedValue(fakeUser as never);
      mockProject.findMany.mockResolvedValue(fakeProjects as never);
      mockCreate.mockResolvedValue(
        fakeCompletion("생성된 자기소개서 내용") as never,
      );
      mockAiAnalysis.create.mockResolvedValue(fakeAiAnalysis as never);

      const result = await generateCoverLetter(USER_ID, APPLICATION_ID);

      expect(result).toEqual(fakeAiAnalysis);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: MODEL,
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: expect.stringContaining(fakeApplication.companyName),
            },
          ],
        }),
      );

      expect(mockAiAnalysis.create).toHaveBeenCalledWith({
        data: {
          type: "COVER_LETTER",
          content: "생성된 자기소개서 내용",
          applicationId: APPLICATION_ID,
          userId: USER_ID,
        },
      });
    });

    it("등록된 프로젝트가 없어도 정상 생성되어야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);
      mockUser.findUnique.mockResolvedValue(fakeUser as never);
      mockProject.findMany.mockResolvedValue([] as never);
      mockCreate.mockResolvedValue(fakeCompletion("내용") as never);
      mockAiAnalysis.create.mockResolvedValue(fakeAiAnalysis as never);

      await generateCoverLetter(USER_ID, APPLICATION_ID);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            {
              role: "user",
              content: expect.stringContaining("등록된 프로젝트 없음"),
            },
          ],
        }),
      );
    });

    it("AI 응답에 content가 없으면 빈 문자열로 저장해야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);
      mockUser.findUnique.mockResolvedValue(fakeUser as never);
      mockProject.findMany.mockResolvedValue(fakeProjects as never);
      mockCreate.mockResolvedValue({ choices: [] } as never);
      mockAiAnalysis.create.mockResolvedValue(fakeAiAnalysis as never);

      await generateCoverLetter(USER_ID, APPLICATION_ID);

      expect(mockAiAnalysis.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ content: "" }),
      });
    });
  });

  // ── generateInterviewQuestions() ───────────────────────────────────────────
  describe("generateInterviewQuestions()", () => {
    it("지원 내역이 없으면 404 에러를 던지고 AI 호출은 하지 않아야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(null);

      await expect(
        generateInterviewQuestions(USER_ID, APPLICATION_ID),
      ).rejects.toThrow("지원 내역을 찾을 수 없습니다.");

      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockAiAnalysis.create).not.toHaveBeenCalled();
    });

    it("면접 질문을 생성하고 중복 없는 기술스택으로 프롬프트를 구성해야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);
      mockProject.findMany.mockResolvedValue(fakeProjects as never);
      mockCreate.mockResolvedValue(fakeCompletion("Q1. ...\nA1. ...") as never);
      mockAiAnalysis.create.mockResolvedValue({
        ...fakeAiAnalysis,
        type: "INTERVIEW_QUESTIONS",
      } as never);

      const result = await generateInterviewQuestions(
        USER_ID,
        APPLICATION_ID,
      );

      expect(result.type).toBe("INTERVIEW_QUESTIONS");

      const callArgs = mockCreate.mock.calls[0]?.[0] as {
        messages: { content: string }[];
      };
      const promptContent = callArgs.messages[0]?.content ?? "";
      // React가 두 프로젝트에 중복으로 들어있으므로 프롬프트엔 한 번만 나와야 함
      expect(promptContent.match(/React/g)).toHaveLength(1);
      expect(promptContent).toContain("Node.js");
      expect(promptContent).toContain("Vue");

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: MODEL, max_tokens: 2000 }),
      );
      expect(mockAiAnalysis.create).toHaveBeenCalledWith({
        data: {
          type: "INTERVIEW_QUESTIONS",
          content: "Q1. ...\nA1. ...",
          applicationId: APPLICATION_ID,
          userId: USER_ID,
        },
      });
    });

    it("등록된 프로젝트가 없으면 '일반 개발'로 프롬프트를 구성해야 한다", async () => {
      mockApplication.findFirst.mockResolvedValue(fakeApplication as never);
      mockProject.findMany.mockResolvedValue([] as never);
      mockCreate.mockResolvedValue(fakeCompletion("...") as never);
      mockAiAnalysis.create.mockResolvedValue(fakeAiAnalysis as never);

      await generateInterviewQuestions(USER_ID, APPLICATION_ID);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            { role: "user", content: expect.stringContaining("일반 개발") },
          ],
        }),
      );
    });
  });

  // ── getAiAnalyses() ────────────────────────────────────────────────────────
  describe("getAiAnalyses()", () => {
    it("해당 지원 내역의 AI 분석 결과를 최신순으로 반환해야 한다", async () => {
      const fakeList = [fakeAiAnalysis];
      mockAiAnalysis.findMany.mockResolvedValue(fakeList as never);

      const result = await getAiAnalyses(USER_ID, APPLICATION_ID);

      expect(result).toEqual(fakeList);
      expect(mockAiAnalysis.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID, applicationId: APPLICATION_ID },
        orderBy: { createdAt: "desc" },
      });
    });

    it("분석 결과가 없으면 빈 배열을 반환해야 한다", async () => {
      mockAiAnalysis.findMany.mockResolvedValue([] as never);

      const result = await getAiAnalyses(USER_ID, APPLICATION_ID);

      expect(result).toEqual([]);
    });
  });
});
