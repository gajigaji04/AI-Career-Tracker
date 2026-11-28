import type { ReactNode } from "react";
import type { ApplicationStatus } from "../../api/application";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "primary" | "info" | "warning" | "success" | "danger";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "지원",
  DOCUMENT_PASS: "서류통과",
  INTERVIEW: "면접",
  FINAL_PASS: "최종합격",
  REJECTED: "불합격",
};

/** 지원 단계별 색: 진행 단계일수록 진하게, 결과는 성공·실패 색 */
const STATUS_TONE: Record<ApplicationStatus, BadgeTone> = {
  APPLIED: "neutral",
  DOCUMENT_PASS: "primary",
  INTERVIEW: "warning",
  FINAL_PASS: "success",
  REJECTED: "danger",
};

type BadgeProps =
  | { status: ApplicationStatus; tone?: never; children?: never; dot?: boolean }
  | { status?: never; tone?: BadgeTone; children: ReactNode; dot?: boolean };

export default function Badge({ status, tone, children, dot = true }: BadgeProps) {
  const resolvedTone = status ? STATUS_TONE[status] : (tone ?? "neutral");
  const content = status ? STATUS_LABEL[status] : children;

  return (
    <span className={`${styles.badge} ${styles[resolvedTone]}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {content}
    </span>
  );
}
