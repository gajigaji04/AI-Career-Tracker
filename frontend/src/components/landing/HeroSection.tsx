import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Icon from "../common/Icon";
import type { IconName } from "../common/Icon";
import { useCountUp } from "../../hooks/useCountUp";
import styles from "./HeroSection.module.css";

const PREVIEW_NAV: IconName[] = ["dashboard", "briefcase", "fileText", "sparkles", "book"];

/** 미리보기용 예시 값 (실제 데이터 아님, 장식) */
const PREVIEW_STAGES = [
  { label: "지원", value: 12, tone: "applied" },
  { label: "서류통과", value: 7, tone: "document" },
  { label: "면접", value: 4, tone: "interview" },
  { label: "최종합격", value: 1, tone: "pass" },
] as const;

export default function HeroSection() {
  const navigate = useNavigate();
  const applications = useCountUp(24);
  const studies = useCountUp(34);
  const aiAnalyses = useCountUp(8);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>
          <Icon name="sparkles" size={14} />
          AI 기반 커리어 관리 플랫폼
        </span>
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

      {/* 제품 화면 미리보기 (장식용) */}
      <div className={styles.mockupWrap} aria-hidden="true">
        <div className={styles.mockup}>
          <div className={styles.mockupSidebar}>
            <span className={styles.mockupLogo} />
            {PREVIEW_NAV.map((name, i) => (
              <span key={name} className={`${styles.mockupNav} ${i === 0 ? styles.mockupNavActive : ""}`}>
                <Icon name={name} size={14} />
              </span>
            ))}
          </div>
          <div className={styles.mockupBody}>
            <div className={styles.statRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>전체 지원</span>
                <span className={`${styles.statValue} num`}>{applications}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>학습 기록</span>
                <span className={`${styles.statValue} num`}>{studies}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>AI 분석</span>
                <span className={`${styles.statValue} num`}>{aiAnalyses}</span>
              </div>
            </div>
            <div className={styles.pipeline}>
              <span className={styles.pipelineTitle}>전형 단계별 분포</span>
              {PREVIEW_STAGES.map((stage, i) => (
                <div key={stage.label} className={styles.pipelineRow}>
                  <span className={styles.pipelineLabel}>{stage.label}</span>
                  <span className={styles.pipelineTrack}>
                    <span
                      className={`${styles.pipelineBar} ${styles[stage.tone]}`}
                      style={{ width: `${(stage.value / 12) * 100}%`, animationDelay: `${i * 80}ms` }}
                    />
                  </span>
                  <span className={`${styles.pipelineValue} num`}>{stage.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
