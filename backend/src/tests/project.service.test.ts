import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../prisma/prisma", () => ({
  prisma: {
    project: {
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
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/project.service";

const mockProject = vi.mocked(prisma.project);

// ─── 공통 더미 데이터 ─────────────────────────────────────────────────────────
const USER_ID = "user-id-123";
const PROJECT_ID = "project-id-456";

const fakeProject = {
  id: PROJECT_ID,
  userId: USER_ID,
  title: "AI CareerHub",
  description: "취업 준비 관리 플랫폼",
  githubUrl: "https://github.com/example/repo",
  deployUrl: "https://example.com",
  techStack: ["React", "TypeScript", "Node.js"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createDto = {
  title: "AI CareerHub",
  description: "취업 준비 관리 플랫폼",
  githubUrl: "https://github.com/example/repo",
  deployUrl: "https://example.com",
  techStack: "React, TypeScript, Node.js",
};

// ─── 테스트 ───────────────────────────────────────────────────────────────────
describe("ProjectService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── createProject() ────────────────────────────────────────────────────────
  describe("createProject()", () => {
    it("프로젝트를 생성하고 반환해야 한다", async () => {
      mockProject.create.mockResolvedValue(fakeProject as never);

      const result = await createProject(USER_ID, createDto);

      expect(result).toEqual(fakeProject);
      // techStack 콤마 문자열 → 배열 변환 확인
      expect(mockProject.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          description: createDto.description,
          githubUrl: createDto.githubUrl,
          deployUrl: createDto.deployUrl,
          techStack: ["React", "TypeScript", "Node.js"],
          userId: USER_ID,
        },
      });
    });

    it("githubUrl, deployUrl이 없으면 null로 저장해야 한다", async () => {
      mockProject.create.mockResolvedValue(fakeProject as never);

      await createProject(USER_ID, {
        title: createDto.title,
        description: createDto.description,
        techStack: createDto.techStack,
      });

      expect(mockProject.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          githubUrl: null,
          deployUrl: null,
        }),
      });
    });
  });

  // ── getProjects() ──────────────────────────────────────────────────────────
  describe("getProjects()", () => {
    it("해당 유저의 프로젝트 목록을 최신순으로 반환해야 한다", async () => {
      const fakeList = [fakeProject];
      mockProject.findMany.mockResolvedValue(fakeList as never);

      const result = await getProjects(USER_ID);

      expect(result).toEqual(fakeList);
      expect(mockProject.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        orderBy: { createdAt: "desc" },
      });
    });

    it("프로젝트가 없으면 빈 배열을 반환해야 한다", async () => {
      mockProject.findMany.mockResolvedValue([] as never);

      const result = await getProjects(USER_ID);

      expect(result).toEqual([]);
    });
  });

  // ── getProjectById() ───────────────────────────────────────────────────────
  describe("getProjectById()", () => {
    it("존재하는 프로젝트를 반환해야 한다", async () => {
      mockProject.findFirst.mockResolvedValue(fakeProject as never);

      const result = await getProjectById(PROJECT_ID, USER_ID);

      expect(result).toEqual(fakeProject);
      expect(mockProject.findFirst).toHaveBeenCalledWith({
        where: { id: PROJECT_ID, userId: USER_ID },
      });
    });

    it("존재하지 않는 id면 404 에러를 던져야 한다", async () => {
      mockProject.findFirst.mockResolvedValue(null);

      await expect(getProjectById("not-exist-id", USER_ID)).rejects.toThrow(
        "프로젝트를 찾을 수 없습니다.",
      );
    });
  });

  // ── updateProject() ────────────────────────────────────────────────────────
  describe("updateProject()", () => {
    const updateData = { title: "수정된 제목", techStack: "Vue, Nuxt" };
    const updatedProject = {
      ...fakeProject,
      title: updateData.title,
      techStack: ["Vue", "Nuxt"],
    };

    it("프로젝트를 수정하고 반환해야 한다", async () => {
      // updateProject 내부에서 getProjectById → findFirst 먼저 호출됨
      mockProject.findFirst.mockResolvedValue(fakeProject as never);
      mockProject.update.mockResolvedValue(updatedProject as never);

      const result = await updateProject(PROJECT_ID, USER_ID, updateData);

      expect(result).toEqual(updatedProject);
      // techStack 콤마 문자열 → 배열 변환 확인, 나머지 필드는 포함 안 됨
      expect(mockProject.update).toHaveBeenCalledWith({
        where: { id: PROJECT_ID },
        data: {
          title: updateData.title,
          techStack: ["Vue", "Nuxt"],
        },
      });
    });

    it("변경된 필드만 update 데이터에 포함해야 한다", async () => {
      mockProject.findFirst.mockResolvedValue(fakeProject as never);
      mockProject.update.mockResolvedValue(fakeProject as never);

      await updateProject(PROJECT_ID, USER_ID, { title: "제목만 수정" });

      expect(mockProject.update).toHaveBeenCalledWith({
        where: { id: PROJECT_ID },
        data: { title: "제목만 수정" },
      });
    });

    it("존재하지 않는 프로젝트면 404 에러를 던지고 update는 호출하지 않아야 한다", async () => {
      mockProject.findFirst.mockResolvedValue(null);

      await expect(
        updateProject("not-exist-id", USER_ID, updateData),
      ).rejects.toThrow("프로젝트를 찾을 수 없습니다.");

      expect(mockProject.update).not.toHaveBeenCalled();
    });
  });

  // ── deleteProject() ────────────────────────────────────────────────────────
  describe("deleteProject()", () => {
    it("프로젝트를 삭제해야 한다", async () => {
      // deleteProject 내부에서 getProjectById → findFirst 먼저 호출됨
      mockProject.findFirst.mockResolvedValue(fakeProject as never);
      mockProject.delete.mockResolvedValue(fakeProject as never);

      await deleteProject(PROJECT_ID, USER_ID);

      expect(mockProject.delete).toHaveBeenCalledWith({
        where: { id: PROJECT_ID },
      });
    });

    it("존재하지 않는 프로젝트면 404 에러를 던지고 delete는 호출하지 않아야 한다", async () => {
      mockProject.findFirst.mockResolvedValue(null);

      await expect(deleteProject("not-exist-id", USER_ID)).rejects.toThrow(
        "프로젝트를 찾을 수 없습니다.",
      );

      expect(mockProject.delete).not.toHaveBeenCalled();
    });
  });
});
