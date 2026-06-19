import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({ message = "아직 기록이 없습니다." }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
