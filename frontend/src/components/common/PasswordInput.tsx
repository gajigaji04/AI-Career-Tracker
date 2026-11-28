import { forwardRef, useState } from "react";
import type { ComponentProps } from "react";
import Input from "./Input";
import Icon from "./Icon";
import styles from "./PasswordInput.module.css";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type" | "trailing">;

/** 비밀번호 입력 + 표시/숨김 토글 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      {...props}
      trailing={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
          aria-pressed={visible}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={17} />
        </button>
      }
    />
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
