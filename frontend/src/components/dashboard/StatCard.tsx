import styles from "./StatCard.module.css";

type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
