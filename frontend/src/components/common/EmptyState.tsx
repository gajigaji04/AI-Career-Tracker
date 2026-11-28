import type { ReactNode } from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  /** 짧은 제목. 없으면 message 만 보인다 */
  title?: string;
  message?: string;
  /**
   * 아이콘 이름(권장) 또는 직접 넣는 노드.
   * 페이지들이 아직 이모지를 넘기므로 임시로 둘 다 받는다 — 페이지 리디자인 후 IconName 만 받게 좁힌다.
   */
  icon?: IconName | ReactNode;
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
  const iconNode =
    typeof icon === "string" && /^[a-zA-Z]+$/.test(icon) ? (
      <Icon name={icon as IconName} size={20} />
    ) : (
      icon
    );

  return (
    <div className={`${styles.empty} ${compact ? styles.compact : ""}`}>
      <span className={styles.icon} aria-hidden="true">
        {iconNode}
      </span>
      {title && <p className={styles.title}>{title}</p>}
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
