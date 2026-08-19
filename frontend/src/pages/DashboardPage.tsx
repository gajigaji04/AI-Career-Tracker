import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { useDashboard } from "../hooks/useDashboard";
import { useApplication } from "../hooks/useApplication";
import StatCard from "../components/dashboard/StatCard";
import ApplicationChart from "../components/dashboard/ApplicationChart";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import PageState from "../components/common/PageState";
import styles from "./DashboardPage.module.css";
import type { ApplicationStatus } from "../api/application";

type Application = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  createdAt: string;
};

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

const IN_PROGRESS: ApplicationStatus[] = ["APPLIED", "DOCUMENT_PASS", "INTERVIEW"];

export default function DashboardPage() {
  const { data: meData } = useMe();
  const { data, isLoading, isError } = useDashboard();
  const { data: appData } = useApplication();

  const applications: Application[] = appData?.data ?? [];

  const chartData = STATUS_ORDER.map((status) => ({
    status: STATUS_LABEL[status],
    count: applications.filter((a) => a.status === status).length,
  }));

  const hasApplications = chartData.some((d) => d.count > 0);

  const inProgressCount = applications.filter((a) =>
    IN_PROGRESS.includes(a.status),
  ).length;

  const recentApplications = [...applications]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  const firstName = meData?.data?.name?.trim();
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "좋은 아침이에요" : hour < 18 ? "오늘도 화이팅이에요" : "오늘 하루도 고생하셨어요";

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1 className={styles.name}>{firstName}님, {timeGreeting}</h1>
        <p className={styles.email}>{meData?.data?.email}</p>
      </div>

      <PageState isLoading={isLoading} isError={isError}>
        <div className={styles.stats}>
          <StatCard
            icon="📚"
            label="학습 기록"
            value={data?.data?.studies ?? 0}
            tone="violet"
          />
          <StatCard
            icon="🗂️"
            label="프로젝트"
            value={data?.data?.projects ?? 0}
            tone="blue"
          />
          <StatCard
            icon="📈"
            label="지원 현황"
            value={data?.data?.applications ?? 0}
            tone="green"
            hint={inProgressCount > 0 ? `진행 중 ${inProgressCount}건` : undefined}
          />
        </div>

        <div className={styles.grid}>
          {hasApplications ? (
            <ApplicationChart data={chartData} />
          ) : (
            <div className={styles.chartEmpty}>
              <EmptyState icon="📈" message="지원 현황을 기록하면 여기에 통계가 표시됩니다." />
            </div>
          )}

          <div className={styles.recentCard}>
            <div className={styles.recentHeader}>
              <p className={styles.cardTitle}>최근 지원 현황</p>
              <Link to="/app/applications" className={styles.recentLink}>
                전체 보기
              </Link>
            </div>

            {recentApplications.length > 0 ? (
              <ul className={styles.recentList}>
                {recentApplications.map((application) => (
                  <li key={application.id} className={styles.recentItem}>
                    <div className={styles.recentItemText}>
                      <span className={styles.recentCompany}>{application.companyName}</span>
                      <span className={styles.recentPosition}>{application.position}</span>
                    </div>
                    <Badge status={application.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.chartEmpty}>
                <EmptyState icon="🗒️" message="아직 등록된 지원 현황이 없습니다." />
              </div>
            )}
          </div>
        </div>
      </PageState>
    </div>
  );
}
