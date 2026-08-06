import { useState } from "react";
import { useApplication } from "../hooks/useApplication";
import { useAiAnalyses, useGenerateCoverLetter, useGenerateInterviewQuestions } from "../hooks/useAI";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import Spinner from "../components/common/Spinner";
import type { ApplicationStatus } from "../api/application";
import type { AiAnalysis } from "../api/ai";
import styles from "./AIPage.module.css";

const TYPE_LABEL: Record<string, string> = {
  COVER_LETTER: "자소서 초안",
  INTERVIEW_QUESTIONS: "면접 질문",
};

const TYPE_ICON: Record<string, string> = {
  COVER_LETTER: "📝",
  INTERVIEW_QUESTIONS: "🎤",
};

type Application = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
};

export default function AIPage() {
  const { data: appData } = useApplication();
  const [selectedAppId, setSelectedAppId] = useState("");
  const [activeResult, setActiveResult] = useState<AiAnalysis | null>(null);

  const { data: analysesData, isLoading: isLoadingHistory } = useAiAnalyses(selectedAppId);
  const generateCoverLetter = useGenerateCoverLetter();
  const generateInterviewQuestions = useGenerateInterviewQuestions();

  const applications: Application[] = appData?.data ?? [];
  const analyses: AiAnalysis[] = analysesData?.data ?? [];

  const isGenerating = generateCoverLetter.isPending || generateInterviewQuestions.isPending;

  const handleGenerate = (type: "cover-letter" | "interview-questions") => {
    if (!selectedAppId) return;
    const mutation = type === "cover-letter" ? generateCoverLetter : generateInterviewQuestions;
    mutation.mutate(selectedAppId, {
      onSuccess: (res) => setActiveResult(res.data),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI 도우미</h1>
        <p className={styles.subtitle}>
          지원 내역을 선택하면 자소서 초안과 예상 면접 질문을 AI가 생성해드립니다.
        </p>
      </div>

      <Select
        label="지원 내역 선택"
        placeholder="-- 지원 내역을 선택하세요 --"
        value={selectedAppId}
        onChange={(e) => {
          setSelectedAppId(e.target.value);
          setActiveResult(null);
        }}
        options={applications.map((app) => ({
          value: app.id,
          label: `${app.companyName} · ${app.position}`,
        }))}
      />

      {selectedAppId && (
        <div className={styles.actions}>
          <Button
            onClick={() => handleGenerate("cover-letter")}
            disabled={isGenerating}
          >
            자소서 초안 생성
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleGenerate("interview-questions")}
            disabled={isGenerating}
          >
            면접 질문 예측
          </Button>
        </div>
      )}

      {isGenerating && (
        <div className={styles.loading}>
          <Spinner />
          AI가 생성 중입니다...
        </div>
      )}

      {activeResult && !isGenerating && (
        <div className={styles.resultBox}>
          <div className={styles.resultHeader}>
            <h2 className={styles.resultTitle}>{TYPE_LABEL[activeResult.type]}</h2>
            <Button variant="secondary" onClick={() => copyToClipboard(activeResult.content)}>
              클립보드 복사
            </Button>
          </div>
          <p className={styles.resultContent}>{activeResult.content}</p>
        </div>
      )}

      {selectedAppId && analyses.length > 0 && (
        <div className={styles.historySection}>
          <h2 className={styles.historyTitle}>이전 생성 기록</h2>
          {analyses.map((item) => (
            <div
              key={item.id}
              className={styles.historyItem}
              onClick={() => setActiveResult(item)}
            >
              <div className={styles.historyMeta}>
                <span className={styles.historyTypeIcon}>{TYPE_ICON[item.type]}</span>
                <span className={styles.historyType}>{TYPE_LABEL[item.type]}</span>
                <span className={styles.historyDate}>
                  {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className={styles.historyPreview}>{item.content}</p>
            </div>
          ))}
        </div>
      )}

      {selectedAppId && !isLoadingHistory && analyses.length === 0 && !activeResult && !isGenerating && (
        <p className={styles.emptyHistory}>
          아직 생성된 AI 분석이 없습니다. 위 버튼으로 생성해보세요.
        </p>
      )}
    </div>
  );
}
