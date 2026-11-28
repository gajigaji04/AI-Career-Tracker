import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import type { IconName } from "../common/Icon";
import styles from "./AuthLayout.module.css";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const HIGHLIGHTS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "briefcase",
    title: "지원 현황 관리",
    text: "지원한 회사와 전형 단계를 표와 칸반으로 한눈에",
  },
  {
    icon: "sparkles",
    title: "AI 도우미",
    text: "내 기록을 바탕으로 자기소개서 초안과 예상 면접 질문 생성",
  },
  {
    icon: "book",
    title: "커리어 기록",
    text: "학습 기록·프로젝트·이력서 버전을 한곳에서",
  },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              <Icon name="target" size={18} strokeWidth={2} />
            </span>
            CareerHub
          </Link>
          <p className={styles.brandTagline}>
            개발자 취업 준비 과정을 통합 관리하는
            <br />
            AI 커리어 관리 플랫폼
          </p>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className={styles.highlightItem}>
                <span className={styles.highlightIcon}>
                  <Icon name={item.icon} size={18} />
                </span>
                <span>
                  <strong className={styles.highlightTitle}>{item.title}</strong>
                  <span className={styles.highlightText}>{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className={styles.formPanel}>
        <Link to="/" className={styles.mobileBrand}>
          <span className={styles.brandMark} aria-hidden="true">
            <Icon name="target" size={14} strokeWidth={2} />
          </span>
          CareerHub
        </Link>
        {children}
      </main>
    </div>
  );
}
