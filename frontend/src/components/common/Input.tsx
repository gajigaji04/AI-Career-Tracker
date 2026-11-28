import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  /** 라벨 옆 보조 표시 (예: "선택") */
  labelHint?: string;
  error?: string;
  hint?: ReactNode;
  /** 입력창 왼쪽 아이콘 (검색창 등) */
  icon?: IconName;
  /** 입력창 오른쪽 안쪽 요소 (비밀번호 표시 버튼 등) */
  trailing?: ReactNode;
  /** 인증 화면처럼 큰 입력창 (44px) */
  large?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelHint, error, hint, icon, trailing, large, id, className, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const messageId = `${inputId}-message`;
    const message = error ?? hint;

    return (
      <div className={styles.field}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
            {labelHint && <span className={styles.labelHint}>{labelHint}</span>}
          </label>
        )}
        <div className={styles.control}>
          {icon && <Icon name={icon} size={16} className={styles.icon} />}
          <input
            ref={ref}
            id={inputId}
            className={[
              styles.input,
              large ? styles.large : "",
              icon ? styles.withIcon : "",
              trailing ? styles.withTrailing : "",
              className ?? "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            {...rest}
          />
          {trailing && <div className={styles.trailing}>{trailing}</div>}
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
