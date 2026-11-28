import styles from "./Spinner.module.css";

type SpinnerProps = {
  size?: number;
  /** current: 부모 글자색을 따른다 (버튼 안 등) */
  tone?: "primary" | "current";
  label?: string;
};

export default function Spinner({ size = 18, tone = "primary", label = "로딩 중" }: SpinnerProps) {
  return (
    <span
      className={`${styles.spinner} ${tone === "current" ? styles.current : ""}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    />
  );
}
