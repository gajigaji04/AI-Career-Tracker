import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  message?: string;
  icon?: string;
};

export default function EmptyState({
  message = "아직 기록이 없습니다.",
  icon = "✦",
}: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon}>{icon}</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
