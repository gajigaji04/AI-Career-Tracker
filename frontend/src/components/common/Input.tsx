import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div className={styles.field}>
        {label && <label className={styles.label}>{label}</label>}
        <input ref={ref} className={styles.input} {...rest} />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
