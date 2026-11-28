import type { ReactNode } from "react";
import type { ApplicationStatus } from "../../api/application";
import { APPLICATION_STATUS_LABEL } from "../../constants/application";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "primary" | "info" | "warning" | "success" | "danger";

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
  const content = status ? APPLICATION_STATUS_LABEL[status] : children;

  return (
    <span className={`${styles.badge} ${styles[resolvedTone]}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {content}
    </span>
  );
}
