import type { ApplicationStatus } from "../api/application";

/** 전형 진행 순서 (파이프라인·필터·차트 공통) */
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "DOCUMENT_PASS",
  "INTERVIEW",
  "FINAL_PASS",
  "REJECTED",
];

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "지원",
  DOCUMENT_PASS: "서류통과",
  INTERVIEW: "면접",
  FINAL_PASS: "최종합격",
  REJECTED: "불합격",
};

/** 아직 결과가 나오지 않은 단계 */
export const IN_PROGRESS_STATUSES: ApplicationStatus[] = ["APPLIED", "DOCUMENT_PASS", "INTERVIEW"];

/** API 응답의 지원 내역 (화면에서 쓰는 필드만) */
export type ApplicationItem = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  memo?: string | null;
  appliedAt?: string;
  createdAt?: string;
};

export const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "-";
