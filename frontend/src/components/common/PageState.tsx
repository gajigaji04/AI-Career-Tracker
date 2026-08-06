import Spinner from "./Spinner";
import styles from "./PageState.module.css";

type PageStateProps = {
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
};

export default function PageState({
  isLoading,
  isError,
  errorMessage,
  children,
}: PageStateProps) {
  if (isLoading) {
    return (
      <div className={styles.state}>
        <Spinner size={24} />
        <span>불러오는 중...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.state}>
        <span className={styles.errorText}>
          {errorMessage ?? "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."}
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
