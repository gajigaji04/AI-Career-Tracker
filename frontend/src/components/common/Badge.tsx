import type { ApplicationStatus } from "../../api/application";
import styles from "./Badge.module.css";

const LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "지원",
  DOCUMENT_PASS: "서류통과",
  INTERVIEW: "면접",
  FINAL_PASS: "최종합격",
  REJECTED: "불합격",
};

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  APPLIED: styles.applied,
  DOCUMENT_PASS: styles.documentPass,
  INTERVIEW: styles.interview,
  FINAL_PASS: styles.finalPass,
  REJECTED: styles.rejected,
};

type BadgeProps = {
  status: ApplicationStatus;
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${STATUS_STYLE[status]}`}>
      {LABEL[status]}
    </span>
  );
}
