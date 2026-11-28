import { useState } from "react";
import { Link } from "react-router-dom";
import { useApplication } from "../hooks/useApplication";
import { useAiAnalyses, useGenerateCoverLetter, useGenerateInterviewQuestions } from "../hooks/useAI";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import type { IconName } from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";
import PageState from "../components/common/PageState";
import Select from "../components/common/Select";
import Spinner from "../components/common/Spinner";
import { useToast } from "../components/common/Toast";
import { formatDate } from "../constants/application";
import type { ApplicationItem } from "../constants/application";
import type { AiAnalysis, AiAnalysisType } from "../api/ai";
import styles from "./AIPage.module.css";

const TYPE_META: Record<AiAnalysisType, { label: string; icon: IconName; description: string }> = {
  COVER_LETTER: {
    label: "자소서 초안",
    icon: "fileText",
    description: "지원 회사·포지션과 내 학습·프로젝트 기록을 바탕으로 초안을 작성합니다.",
  },
  INTERVIEW_QUESTIONS: {
    label: "면접 질문",
    icon: "message",
    description: "포지션과 내 프로젝트·학습 기록을 바탕으로 예상 질문을 뽑습니다.",
  },
};

export default function AIPage() {
  const { data: appData, isLoading: isLoadingApps, isError: isAppsError, refetch } = useApplication();
  const [selectedAppId, setSelectedAppId] = useState("");
  const [activeResult, setActiveResult] = useState<AiAnalysis | null>(null);
  const { showToast } = useToast();

  const { data: analysesData, isLoading: isLoadingHistory } = useAiAnalyses(selectedAppId);
  const generateCoverLetter = useGenerateCoverLetter();
  const generateInterviewQuestions = useGenerateInterviewQuestions();

  const applications: ApplicationItem[] = appData?.data ?? [];
  const analyses: AiAnalysis[] = analysesData?.data ?? [];
  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const isGenerating = generateCoverLetter.isPending || generateInterviewQuestions.isPending;
  const pendingType: AiAnalysisType | null = generateCoverLetter.isPending
    ? "COVER_LETTER"
    : generateInterviewQuestions.isPending
      ? "INTERVIEW_QUESTIONS"
      : null;

  const handleGenerate = (type: "cover-letter" | "interview-questions") => {
    if (!selectedAppId) return;
    const mutation = type === "cover-letter" ? generateCoverLetter : generateInterviewQuestions;
    mutation.mutate(selectedAppId, {
      onSuccess: (res) => setActiveResult(res.data),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => showToast("클립보드에 복사했습니다."),
      () => showToast("복사하지 못했습니다. 직접 선택해 복사해주세요.", "error"),
    );
  };

  const renderResult = () => {
    if (isGenerating && pendingType) {
      return (
        <Card>
          <div className={styles.generating} aria-live="polite">
            <Spinner size={24} />
            <p className={styles.generatingTitle}>AI가 {TYPE_META[pendingType].label}을(를) 생성 중입니다</p>
            <p className={styles.generatingHint}>창을 닫지 말고 잠시만 기다려주세요.</p>
          </div>
        </Card>
      );
    }

    if (activeResult) {
      const meta = TYPE_META[activeResult.type];
      return (
        <Card
          title={
            <span className={styles.resultTitle}>
              <Icon name={meta.icon} size={18} />
              {meta.label}
            </span>
          }
          description={
            selectedApp
              ? `${selectedApp.companyName} · ${selectedApp.position} · ${formatDate(activeResult.createdAt)}`
              : formatDate(activeResult.createdAt)
          }
          action={
            <Button
              variant="secondary"
              size="sm"
              icon="copy"
              onClick={() => copyToClipboard(activeResult.content)}
            >
              복사
            </Button>
          }
        >
          <p className={styles.resultContent}>{activeResult.content}</p>
          <p className={styles.disclaimer}>
            <Icon name="info" size={14} />
            AI가 만든 초안입니다. 사실과 다른 내용이 없는지 확인한 뒤 내 경험에 맞게 다듬어 사용하세요.
          </p>
        </Card>
      );
    }

    return (
      <Card>
        <EmptyState
          icon="sparkles"
          title={selectedAppId ? "생성할 항목을 선택하세요" : "지원 내역을 먼저 선택하세요"}
          message={
            selectedAppId
              ? "왼쪽에서 자소서 초안 또는 면접 질문을 생성하거나, 이전 생성 기록을 열어보세요."
              : "선택한 지원 내역을 바탕으로 자소서 초안과 예상 면접 질문을 만들어 드립니다."
          }
        />
      </Card>
    );
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="AI 도우미"
        description="지원 내역을 선택하면 자소서 초안과 예상 면접 질문을 AI가 생성해드립니다."
      />

      <PageState isLoading={isLoadingApps} isError={isAppsError} onRetry={() => void refetch()}>
        {applications.length === 0 ? (
          <Card>
            <EmptyState
              icon="briefcase"
              title="지원 내역이 필요합니다"
              message="AI 도우미는 지원 내역을 기준으로 동작합니다. 먼저 지원 현황에 지원한 회사를 추가하세요."
              action={
                <Link to="/app/applications" className={styles.linkButton}>
                  지원 현황으로 이동
                  <Icon name="chevronRight" size={16} />
                </Link>
              }
            />
          </Card>
        ) : (
          <div className={styles.layout}>
            <div className={styles.side}>
              <Card title="1. 지원 내역 선택">
                <Select
                  aria-label="지원 내역 선택"
                  placeholder="지원 내역을 선택하세요"
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
                {selectedApp && (
                  <div className={styles.selectedMeta}>
                    <Badge status={selectedApp.status} />
                    <span className="num">
                      지원일 {formatDate(selectedApp.appliedAt ?? selectedApp.createdAt)}
                    </span>
                  </div>
                )}
              </Card>

              <Card title="2. 생성하기">
                <div className={styles.actions}>
                  {(
                    [
                      ["COVER_LETTER", "cover-letter"],
                      ["INTERVIEW_QUESTIONS", "interview-questions"],
                    ] as const
                  ).map(([type, endpoint]) => (
                    <button
                      key={type}
                      type="button"
                      className={styles.actionTile}
                      onClick={() => handleGenerate(endpoint)}
                      disabled={!selectedAppId || isGenerating}
                    >
                      <span className={styles.actionIcon}>
                        {pendingType === type ? (
                          <Spinner size={16} tone="current" />
                        ) : (
                          <Icon name={TYPE_META[type].icon} size={18} />
                        )}
                      </span>
                      <span className={styles.actionText}>
                        <span className={styles.actionLabel}>
                          {type === "COVER_LETTER" ? "자소서 초안 생성" : "면접 질문 예측"}
                        </span>
                        <span className={styles.actionDesc}>{TYPE_META[type].description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              {selectedAppId && (
                <Card title="이전 생성 기록" padding="none">
                  {isLoadingHistory ? (
                    <div className={styles.historyLoading}>
                      <Spinner size={16} />
                    </div>
                  ) : analyses.length > 0 ? (
                    <ul className={styles.history}>
                      {analyses.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={`${styles.historyItem} ${
                              activeResult?.id === item.id ? styles.historyActive : ""
                            }`}
                            aria-current={activeResult?.id === item.id ? "true" : undefined}
                            onClick={() => setActiveResult(item)}
                          >
                            <span className={styles.historyMeta}>
                              <Icon name={TYPE_META[item.type].icon} size={14} />
                              <span className={styles.historyType}>{TYPE_META[item.type].label}</span>
                              <span className={`${styles.historyDate} num`}>
                                {formatDate(item.createdAt)}
                              </span>
                            </span>
                            <span className={styles.historyPreview}>{item.content}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.historyEmpty}>아직 생성된 기록이 없습니다.</p>
                  )}
                </Card>
              )}
            </div>

            <div className={styles.main}>{renderResult()}</div>
          </div>
        )}
      </PageState>
    </div>
  );
}
