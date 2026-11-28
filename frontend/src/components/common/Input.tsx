import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  /** 입력창 왼쪽 아이콘 (검색창 등) */
  icon?: IconName;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, id, className, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const messageId = `${inputId}-message`;
    const message = error ?? hint;

    return (
      <div className={styles.field}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className={styles.control}>
          {icon && <Icon name={icon} size={16} className={styles.icon} />}
          <input
            ref={ref}
            id={inputId}
            className={[styles.input, icon ? styles.withIcon : "", className ?? ""]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            {...rest}
          />
        </div>
        {message && (
          <p id={messageId} className={error ? styles.error : styles.hint}>
            {message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
