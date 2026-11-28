import Spinner from "./Spinner";
import Icon from "./Icon";
import Button from "./Button";
import styles from "./PageState.module.css";

type PageStateProps = {
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  /** 주면 오류 화면에 "다시 시도" 버튼이 나온다 (예: query.refetch) */
  onRetry?: () => void;
  children: React.ReactNode;
};

export default function PageState({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  children,
}: PageStateProps) {
  if (isLoading) {
    return (
      <div className={styles.state} aria-live="polite">
        <Spinner size={22} />
        <span className={styles.loadingText}>불러오는 중...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${styles.state} ${styles.error}`} role="alert">
        <span className={styles.errorIcon}>
          <Icon name="alertCircle" size={20} />
        </span>
        <p className={styles.errorTitle}>데이터를 불러오지 못했습니다</p>
        <p className={styles.errorText}>
          {errorMessage ?? "잠시 후 다시 시도해주세요."}
        </p>
        {onRetry && (
          <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>
            다시 시도
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
