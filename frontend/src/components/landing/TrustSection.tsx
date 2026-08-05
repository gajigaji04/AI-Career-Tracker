import styles from "./TrustSection.module.css";

const TRUST_POINTS = [
  {
    icon: "🔒",
    title: "HTTPS 보안 연결",
    description: "모든 통신은 Let's Encrypt 인증서를 통해 암호화됩니다.",
  },
  {
    icon: "🍪",
    title: "httpOnly 쿠키 인증",
    description: "인증 토큰은 자바스크립트로 접근할 수 없는 쿠키에 저장되어 XSS로부터 안전합니다.",
  },
  {
    icon: "🤖",
    title: "실제 LLM 기반 분석",
    description: "내가 기록한 프로젝트와 지원 내역을 바탕으로 매번 새롭게 생성되는 맞춤 결과물입니다.",
  },
];

export default function TrustSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>안전하게, 실제로 동작하는 서비스</h2>

        <div className={styles.grid}>
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className={styles.item}>
              <span className={styles.icon}>{point.icon}</span>
              <div>
                <h3 className={styles.itemTitle}>{point.title}</h3>
                <p className={styles.itemDesc}>{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
