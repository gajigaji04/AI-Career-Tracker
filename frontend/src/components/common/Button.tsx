import type { ButtonHTMLAttributes, ReactNode } from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import Spinner from "./Spinner";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dangerSolid";
type ButtonSize = "sm" | "md";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children?: ReactNode;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 글자 앞에 붙는 아이콘 */
  icon?: IconName;
  /** 진행 중이면 스피너를 보이고 클릭을 막는다 */
  loading?: boolean;
  fullWidth?: boolean;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    !children ? styles.iconOnly : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === "sm" ? 12 : 14} tone="current" />
      ) : (
        icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />
      )}
      {children}
    </button>
  );
}
