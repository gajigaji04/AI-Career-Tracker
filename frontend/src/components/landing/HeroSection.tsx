import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>AI 기반 커리어 관리 플랫폼</span>
        <h1 className={styles.title}>
          취업 준비의 모든 기록을,
          <br />
          <span className={styles.accent}>하나의 흐름</span>으로
        </h1>
        <p className={styles.subtitle}>
          학습 기록, 프로젝트, 지원 현황을 한 곳에서 관리하고,
          <br />
          쌓인 데이터를 AI가 자기소개서와 면접 준비로 연결해드립니다.
        </p>
        <div className={styles.ctaRow}>
          <Button variant="primary" onClick={() => navigate("/register")}>
            무료 시작하기
          </Button>
          <Button variant="secondary" onClick={() => navigate("/login")}>
            로그인
          </Button>
        </div>
      </div>

      <div className={styles.mockupWrap} aria-hidden="true">
        <div className={styles.mockup}>
          <div className={styles.mockupHeader}>
            <span className={styles.mockupDot} />
            <span className={styles.mockupDot} />
            <span className={styles.mockupDot} />
          </div>
          <div className={styles.mockupBody}>
            <div className={styles.statRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>지원 현황</span>
                <span className={styles.statValue}>12</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>학습 기록</span>
                <span className={styles.statValue}>34</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>AI 분석</span>
                <span className={styles.statValue}>8</span>
              </div>
            </div>
            <div className={styles.chart}>
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <span
                  key={i}
                  className={styles.bar}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
