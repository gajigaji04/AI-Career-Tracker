import Groq from "groq-sdk";
import { prisma } from "../prisma/prisma";
import { AppError } from "../errors/AppError";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

export const generateCoverLetter = async (
  userId: string,
  applicationId: string,
) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });
  if (!application) throw new AppError("지원 내역을 찾을 수 없습니다.", 404);

  const [user, projects, studies] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    prisma.project.findMany({ where: { userId }, take: 5 }),
    prisma.study.findMany({ where: { userId }, orderBy: { studyDate: "desc" }, take: 5 }),
  ]);

  const projectDesc = projects.length
    ? projects
        .map(
          (p: (typeof projects)[number]) =>
            `- ${p.title}: ${p.description} (기술스택: ${p.techStack.join(", ")})`,
        )
        .join("\n")
    : "등록된 프로젝트 없음";

  const studyDesc = studies.length
    ? studies
        .map((s: (typeof studies)[number]) => `- ${s.title} (${s.category})`)
        .join("\n")
    : "등록된 학습 기록 없음";

  const prompt = `당신은 취업 전문가입니다. 다음 정보를 바탕으로 한국어 자기소개서 초안을 작성해주세요.

지원 회사: ${application.companyName}
지원 포지션: ${application.position}
지원자 이름: ${user?.name ?? "지원자"}

보유 프로젝트:
${projectDesc}

최근 학습 기록:
${studyDesc}

자기소개서를 지원동기, 직무 역량, 프로젝트 경험, 입사 후 포부 순으로 작성해주세요. 최근 학습 기록에서 직무와 관련된 내용이 있다면 자연스럽게 녹여주세요. 각 항목은 2-3문단으로 구성해주세요.`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const content = completion.choices[0]?.message?.content ?? "";

  return prisma.aiAnalysis.create({
    data: { type: "COVER_LETTER", content, applicationId, userId },
  });
};

export const generateInterviewQuestions = async (
  userId: string,
  applicationId: string,
) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });
  if (!application) throw new AppError("지원 내역을 찾을 수 없습니다.", 404);

  const [projects, studies] = await Promise.all([
    prisma.project.findMany({ where: { userId }, take: 5 }),
    prisma.study.findMany({ where: { userId }, orderBy: { studyDate: "desc" }, take: 5 }),
  ]);

  const techStacks = [
    ...new Set(projects.flatMap((p: (typeof projects)[number]) => p.techStack)),
  ];

  const studyTopics = [
    ...new Set(studies.map((s: (typeof studies)[number]) => s.category)),
  ];

  const prompt = `당신은 ${application.companyName}의 시니어 개발자 면접관입니다.
${application.position} 포지션 지원자를 위한 예상 면접 질문 7개와 각각의 모범 답변을 작성해주세요.

지원자의 주요 기술스택: ${techStacks.length ? techStacks.join(", ") : "일반 개발"}
지원자의 최근 학습 주제: ${studyTopics.length ? studyTopics.join(", ") : "없음"}

기술스택 질문뿐 아니라, 최근 학습 주제와 관련된 질문도 하나 이상 포함해주세요.

각 질문은 반드시 다음 형식으로 작성해주세요:
Q1. [질문]
A1. [모범 답변]

Q2. [질문]
A2. [모범 답변]`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = completion.choices[0]?.message?.content ?? "";

  return prisma.aiAnalysis.create({
    data: { type: "INTERVIEW_QUESTIONS", content, applicationId, userId },
  });
};

export const getAiAnalyses = async (userId: string, applicationId: string) => {
  return prisma.aiAnalysis.findMany({
    where: { userId, applicationId },
    orderBy: { createdAt: "desc" },
  });
};
