import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./SegmentedControl.module.css";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
};

type SegmentedControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** 스크린리더용 묶음 이름 */
  label: string;
};

/** 보기 전환 등 2~4개 중 하나를 고르는 토글 */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.item} ${opt.value === value ? styles.active : ""}`}
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <Icon name={opt.icon} size={15} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
