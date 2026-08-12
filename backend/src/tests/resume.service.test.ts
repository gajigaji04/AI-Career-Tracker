import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../prisma/prisma", () => ({
  prisma: {
    resume: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../config/s3", () => ({
  s3: { send: vi.fn() },
  BUCKET: "test-bucket",
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(),
}));

// ─── 2. mock 모듈 및 테스트 대상 import ──────────────────────────────────────
import { prisma } from "../prisma/prisma";
import { s3, BUCKET } from "../config/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  uploadResume,
  getResumes,
  deleteResume,
} from "../services/resume.service";

const mockResume = vi.mocked(prisma.resume);
const mockS3Send = vi.mocked(s3.send);
const mockGetSignedUrl = vi.mocked(getSignedUrl);

// ─── 공통 더미 데이터 ─────────────────────────────────────────────────────────
const USER_ID = "user-id-123";
const RESUME_ID = "resume-id-456";
const FIXED_NOW = new Date("2026-07-01T00:00:00.000Z").getTime();

const fakeFile = {
  fieldname: "resume",
  originalname: "resume.pdf",
  encoding: "7bit",
  mimetype: "application/pdf",
  size: 12345,
  buffer: Buffer.from("dummy pdf content"),
  destination: "",
  filename: "",
  path: "",
  stream: undefined,
} as unknown as Express.Multer.File;

const fakeResume = {
  id: RESUME_ID,
  userId: USER_ID,
  fileName: "resume.pdf",
  fileUrl: `https://${BUCKET}.s3.ap-northeast-2.amazonaws.com/resumes/${USER_ID}/${FIXED_NOW}-resume.pdf`,
  version: 1,
  createdAt: new Date(),
};

// ─── 테스트 ───────────────────────────────────────────────────────────────────
describe("ResumeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWS_REGION = "ap-northeast-2";
    vi.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── uploadResume() ─────────────────────────────────────────────────────────
  describe("uploadResume()", () => {
    it("기존 이력서가 없으면 버전 1로 업로드해야 한다", async () => {
      mockResume.findMany.mockResolvedValue([] as never);
      mockS3Send.mockResolvedValue({} as never);
      mockResume.create.mockResolvedValue(fakeResume as never);

      const result = await uploadResume(USER_ID, fakeFile);

      expect(result).toEqual(fakeResume);

      // S3 업로드 커맨드 검증
      expect(mockS3Send).toHaveBeenCalledTimes(1);
      const putCommand = mockS3Send.mock.calls[0]?.[0] as unknown as {
        input: Record<string, unknown>;
      };
      const expectedKey = `resumes/${USER_ID}/${FIXED_NOW}-resume.pdf`;
      expect(putCommand.input).toEqual({
        Bucket: BUCKET,
        Key: expectedKey,
        Body: fakeFile.buffer,
        ContentType: fakeFile.mimetype,
      });

      // DB 저장 데이터 검증
      expect(mockResume.create).toHaveBeenCalledWith({
        data: {
          fileName: "resume.pdf",
          fileUrl: `https://${BUCKET}.s3.ap-northeast-2.amazonaws.com/${expectedKey}`,
          version: 1,
          userId: USER_ID,
        },
      });
    });

    it("기존 이력서가 있으면 최고 버전 + 1로 업로드해야 한다", async () => {
      mockResume.findMany.mockResolvedValue([
        { version: 1 },
        { version: 3 },
        { version: 2 },
      ] as never);
      mockS3Send.mockResolvedValue({} as never);
      mockResume.create.mockResolvedValue(fakeResume as never);

      await uploadResume(USER_ID, fakeFile);

      expect(mockResume.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ version: 4 }),
      });
    });
  });

  // ── getResumes() ───────────────────────────────────────────────────────────
  describe("getResumes()", () => {
    it("해당 유저의 이력서 목록을, fileUrl을 서명된 URL로 바꿔서 반환해야 한다", async () => {
      mockResume.findMany.mockResolvedValue([fakeResume] as never);
      mockGetSignedUrl.mockResolvedValue("https://signed.example.com/resume.pdf?sig=abc" as never);

      const result = await getResumes(USER_ID);

      expect(result).toEqual([
        { ...fakeResume, fileUrl: "https://signed.example.com/resume.pdf?sig=abc" },
      ]);
      expect(mockResume.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        orderBy: { version: "desc" },
      });

      // 5분짜리 서명 URL을 원본 S3 key로 발급하는지 확인
      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        s3,
        expect.objectContaining({
          input: {
            Bucket: BUCKET,
            Key: `resumes/${USER_ID}/${FIXED_NOW}-resume.pdf`,
          },
        }),
        { expiresIn: 300 },
      );
    });

    it("이력서가 없으면 빈 배열을 반환해야 한다", async () => {
      mockResume.findMany.mockResolvedValue([] as never);

      const result = await getResumes(USER_ID);

      expect(result).toEqual([]);
      expect(mockGetSignedUrl).not.toHaveBeenCalled();
    });
  });

  // ── deleteResume() ─────────────────────────────────────────────────────────
  describe("deleteResume()", () => {
    it("이력서를 삭제하고 S3 객체도 함께 삭제해야 한다", async () => {
      mockResume.findFirst.mockResolvedValue(fakeResume as never);
      mockS3Send.mockResolvedValue({} as never);
      mockResume.delete.mockResolvedValue(fakeResume as never);

      await deleteResume(RESUME_ID, USER_ID);

      expect(mockS3Send).toHaveBeenCalledTimes(1);
      const deleteCommand = mockS3Send.mock.calls[0]?.[0] as unknown as {
        input: Record<string, unknown>;
      };
      expect(deleteCommand.input).toEqual({
        Bucket: BUCKET,
        Key: `resumes/${USER_ID}/${FIXED_NOW}-resume.pdf`,
      });

      expect(mockResume.delete).toHaveBeenCalledWith({
        where: { id: RESUME_ID },
      });
    });

    it("존재하지 않는 이력서면 404 에러를 던지고 삭제 로직을 실행하지 않아야 한다", async () => {
      mockResume.findFirst.mockResolvedValue(null);

      await expect(deleteResume("not-exist-id", USER_ID)).rejects.toThrow(
        "이력서를 찾을 수 없습니다.",
      );

      expect(mockS3Send).not.toHaveBeenCalled();
      expect(mockResume.delete).not.toHaveBeenCalled();
    });
  });
});
