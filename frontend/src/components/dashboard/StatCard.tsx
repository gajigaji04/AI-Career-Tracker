import Icon from "../common/Icon";
import type { IconName } from "../common/Icon";
import styles from "./StatCard.module.css";

type StatCardTone = "primary" | "warning" | "success" | "neutral";

type StatCardProps = {
  label: string;
  value: number;
  icon?: IconName;
  tone?: StatCardTone;
  /** 값 아래 보조 설명 */
  hint?: string;
  unit?: string;
};

export default function StatCard({
  label,
  value,
  icon,
  tone = "neutral",
  hint,
  unit = "건",
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <p className={styles.label}>{label}</p>
        {icon && (
          <span className={`${styles.icon} ${styles[tone]}`}>
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <p className={styles.valueRow}>
        <span className={`${styles.value} num`}>{value.toLocaleString("ko-KR")}</span>
        <span className={styles.unit}>{unit}</span>
      </p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
