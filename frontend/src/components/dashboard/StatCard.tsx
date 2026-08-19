import styles from "./StatCard.module.css";

type StatCardTone = "violet" | "blue" | "green";

type StatCardProps = {
  label: string;
  value: number;
  icon?: string;
  tone?: StatCardTone;
  hint?: string;
};

export default function StatCard({ label, value, icon, tone = "violet", hint }: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.headerRow}>
        <p className={styles.label}>{label}</p>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <span className={styles.value}>{value}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
