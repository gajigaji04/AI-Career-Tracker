import { useMe } from "../hooks/useMe";
import { useDashboard } from "../hooks/useDashboard";
import { useApplication } from "../hooks/useApplication";
import StatCard from "../components/dashboard/StatCard";
import ApplicationChart from "../components/dashboard/ApplicationChart";
import styles from "./DashboardPage.module.css";
import type { ApplicationStatus } from "../api/application";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "지원",
  DOCUMENT_PASS: "서류통과",
  INTERVIEW: "면접",
  FINAL_PASS: "최종합격",
  REJECTED: "불합격",
};

const STATUS_ORDER: ApplicationStatus[] = [
  "APPLIED",
  "DOCUMENT_PASS",
  "INTERVIEW",
  "FINAL_PASS",
  "REJECTED",
];

export default function DashboardPage() {
  const { data: meData } = useMe();
  const { data, isLoading } = useDashboard();
  const { data: appData } = useApplication();

  const chartData = STATUS_ORDER.map((status) => ({
    status: STATUS_LABEL[status],
    count: (appData?.data ?? []).filter(
      (a: { status: ApplicationStatus }) => a.status === status,
    ).length,
  }));

  const hasApplications = chartData.some((d) => d.count > 0);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1 className={styles.name}>안녕하세요, {meData?.data?.name}님</h1>
        <p className={styles.email}>{meData?.data?.email}</p>
      </div>

      <div className={styles.stats}>
        <StatCard label="학습 기록" value={data?.data?.studies ?? 0} />
        <StatCard label="프로젝트" value={data?.data?.projects ?? 0} />
        <StatCard label="지원 현황" value={data?.data?.applications ?? 0} />
      </div>

      {hasApplications && (
        <div className={styles.chart}>
          <ApplicationChart data={chartData} />
        </div>
      )}
    </div>
  );
}
