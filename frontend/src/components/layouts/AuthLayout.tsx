import styles from "./AuthLayout.module.css";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const HIGHLIGHTS = [
  "학습 기록, 프로젝트, 지원 현황을 한 곳에서",
  "AI가 자기소개서와 예상 면접 질문을 생성",
  "취업 준비 과정을 데이터로 관리",
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <span className={styles.brandIcon}>✦</span>
          <h1 className={styles.brandName}>CareerHub</h1>
          <p className={styles.brandTagline}>
            개발자 취업 준비 과정을 통합 관리하는
            <br />
            AI 커리어 관리 플랫폼
          </p>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((item) => (
              <li key={item} className={styles.highlightItem}>
                <span className={styles.highlightDot} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className={styles.formPanel}>{children}</main>
    </div>
  );
}
