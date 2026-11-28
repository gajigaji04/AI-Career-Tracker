import type { ReactNode } from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  /** 짧은 제목. 없으면 message 만 보인다 */
  title?: string;
  message?: string;
  icon?: IconName;
  /** 다음 행동 버튼 등 */
  action?: ReactNode;
  compact?: boolean;
};

export default function EmptyState({
  title,
  message = "아직 기록이 없습니다.",
  icon = "inbox",
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={`${styles.empty} ${compact ? styles.compact : ""}`}>
      <span className={styles.icon} aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      {title && <p className={styles.title}>{title}</p>}
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
