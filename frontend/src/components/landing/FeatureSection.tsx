import styles from "./FeatureSection.module.css";

const FEATURES = [
  {
    icon: "✨",
    title: "AI 분석",
    description: "지원 내역과 프로젝트를 바탕으로 자기소개서 초안과 예상 면접 질문을 생성합니다.",
  },
  {
    icon: "📚",
    title: "학습 기록 관리",
    description: "매일의 학습 내용과 시간을 기록하고, 카테고리별로 성장 과정을 돌아볼 수 있습니다.",
  },
  {
    icon: "🗂️",
    title: "프로젝트 관리",
    description: "기술 스택과 링크를 포함한 프로젝트 이력을 정리하고 자기소개서 소재로 바로 연결합니다.",
  },
  {
    icon: "📈",
    title: "지원 현황 관리",
    description: "지원한 회사와 전형 단계를 한눈에 추적하고, 통계 대시보드로 진행 상황을 확인합니다.",
  },
];

export default function FeatureSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h2 className={styles.title}>취업 준비에 필요한 모든 것</h2>
          <p className={styles.subtitle}>흩어져 있던 기록을 한 곳에 모으고, 다음 단계로 바로 연결합니다.</p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.card}>
              <span className={styles.icon}>{feature.icon}</span>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
