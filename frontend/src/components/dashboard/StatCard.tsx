import styles from "./StatCard.module.css";

type StatCardProps = {
  label: string;
  value: number;
  icon?: string;
};

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <p className={styles.label}>{label}</p>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
