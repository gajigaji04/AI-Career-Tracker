import styles from "./Spinner.module.css";

type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size = 18 }: SpinnerProps) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="status"
      aria-label="로딩 중"
    />
  );
}
