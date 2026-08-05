import styles from "./ProcessSection.module.css";

const STEPS = [
  {
    step: "01",
    title: "가입하고 기록 시작",
    description: "회원가입 후 학습, 프로젝트, 지원 현황을 자유롭게 기록합니다.",
  },
  {
    step: "02",
    title: "데이터를 꾸준히 쌓기",
    description: "기록이 쌓일수록 나의 성장 과정과 강점이 데이터로 드러납니다.",
  },
  {
    step: "03",
    title: "AI로 준비 자료 생성",
    description: "지원 내역과 프로젝트를 바탕으로 자기소개서와 면접 질문을 받아봅니다.",
  },
];

export default function ProcessSection() {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>이렇게 사용해요</h2>
      </div>

      <div className={styles.steps}>
        {STEPS.map((item, index) => (
          <div key={item.step} className={styles.step}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>{item.step}</span>
              {index < STEPS.length - 1 && <span className={styles.connector} />}
            </div>
            <h3 className={styles.stepTitle}>{item.title}</h3>
            <p className={styles.stepDesc}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
