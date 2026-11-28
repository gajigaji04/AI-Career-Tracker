import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  /** 헤더 오른쪽 (링크·버튼) */
  action?: ReactNode;
  /** none: 표처럼 본문이 가장자리까지 닿을 때 */
  padding?: "none" | "md";
  as?: "section" | "div" | "article";
  children?: ReactNode;
};

export default function Card({
  title,
  description,
  action,
  padding = "md",
  as: Tag = "section",
  className,
  children,
  ...rest
}: CardProps) {
  const hasHeader = title || description || action;

  return (
    <Tag className={[styles.card, className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {hasHeader && (
        <header className={styles.header}>
          <div className={styles.heading}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </header>
      )}
      <div className={padding === "none" ? styles.bodyFlush : styles.body}>{children}</div>
    </Tag>
  );
}
