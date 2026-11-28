import type { ReactNode, TableHTMLAttributes } from "react";
import styles from "./Table.module.css";

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  children: ReactNode;
  /** 스크린리더용 표 설명 */
  caption?: string;
};

/**
 * 공통 데이터 표. 안쪽은 일반 <thead>/<tbody>/<tr>/<th>/<td> 를 그대로 쓴다.
 * 좁은 화면에서는 가로 스크롤된다.
 * 숫자 열은 <td className="num"> 처럼 전역 .num 으로 자릿수 폭을 고정한다.
 */
export default function Table({ children, caption, className, ...rest }: TableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={[styles.table, className ?? ""].filter(Boolean).join(" ")} {...rest}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}
