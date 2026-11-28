import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { useDashboard } from "../hooks/useDashboard";
import { useApplication } from "../hooks/useApplication";
import StatCard from "../components/dashboard/StatCard";
import ApplicationChart from "../components/dashboard/ApplicationChart";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";
import PageState from "../components/common/PageState";
import Table from "../components/common/Table";
import {
  APPLICATION_STATUSES,
  IN_PROGRESS_STATUSES,
  formatDate,
} from "../constants/application";
import type { ApplicationItem } from "../constants/application";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { data: meData } = useMe();
  const dashboard = useDashboard();
  const applicationsQuery = useApplication();

  const counts = dashboard.data?.data;
  const applications: ApplicationItem[] = applicationsQuery.data?.data ?? [];

  const countOf = (status: ApplicationItem["status"]) =>
    applications.filter((a) => a.status === status).length;

  const chartData = APPLICATION_STATUSES.map((status) => ({ status, count: countOf(status) }));
  const hasApplications = applications.length > 0;
  const inProgressCount = applications.filter((a) => IN_PROGRESS_STATUSES.includes(a.status)).length;

  const recentApplications = [...applications]
    .sort((a, b) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1))
    .slice(0, 5);

  const firstName = meData?.data?.name?.trim();
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "좋은 아침이에요" : hour < 18 ? "오늘도 화이팅이에요" : "오늘 하루도 고생하셨어요";

  return (
    <div className={styles.page}>
      <PageHeader
        title={firstName ? `${firstName}님, ${timeGreeting}` : timeGreeting}
        description="지원 현황과 커리어 기록을 한눈에 확인하세요."
      />

      <PageState
        isLoading={dashboard.isLoading || applicationsQuery.isLoading}
        isError={dashboard.isError || applicationsQuery.isError}
        onRetry={() => {
          void dashboard.refetch();
          void applicationsQuery.refetch();
        }}
      >
        <section className={styles.stats} aria-label="지원 요약">
          <StatCard label="전체 지원" value={counts?.applications ?? 0} icon="briefcase" />
          <StatCard
            label="진행 중"
            value={inProgressCount}
            icon="clock"
            tone="primary"
            hint="지원 · 서류통과 · 면접 단계"
          />
          <StatCard label="면접 단계" value={countOf("INTERVIEW")} icon="message" tone="warning" />
          <StatCard label="최종 합격" value={countOf("FINAL_PASS")} icon="trophy" tone="success" />
        </section>

        <div className={styles.grid}>
          <Card
            title="전형 단계별 분포"
            description={hasApplications ? `전체 ${applications.length}건 기준` : undefined}
          >
            {hasApplications ? (
              <ApplicationChart data={chartData} />
            ) : (
              <EmptyState
                compact
                icon="chart"
                message="지원 내역을 기록하면 단계별 통계가 표시됩니다."
              />
            )}
          </Card>

          <Card title="커리어 기록" padding="none">
            <ul className={styles.records}>
              <li>
                <Link to="/app/studies" className={styles.recordLink}>
                  <span className={styles.recordIcon}>
                    <Icon name="book" size={16} />
                  </span>
                  <span className={styles.recordLabel}>학습 기록</span>
                  <span className={`${styles.recordValue} num`}>{counts?.studies ?? 0}건</span>
                  <Icon name="chevronRight" size={16} className={styles.recordChevron} />
                </Link>
              </li>
              <li>
                <Link to="/app/projects" className={styles.recordLink}>
                  <span className={styles.recordIcon}>
                    <Icon name="folder" size={16} />
                  </span>
                  <span className={styles.recordLabel}>프로젝트</span>
                  <span className={`${styles.recordValue} num`}>{counts?.projects ?? 0}건</span>
                  <Icon name="chevronRight" size={16} className={styles.recordChevron} />
                </Link>
              </li>
            </ul>
          </Card>
        </div>

        <Card
          title="최근 지원"
          padding="none"
          action={
            <Link to="/app/applications" className={styles.moreLink}>
              전체 보기
              <Icon name="chevronRight" size={14} />
            </Link>
          }
        >
          {recentApplications.length > 0 ? (
            <Table caption="최근 지원 내역">
              <thead>
                <tr>
                  <th scope="col">회사</th>
                  <th scope="col">포지션</th>
                  <th scope="col">단계</th>
                  <th scope="col" className={styles.dateCol}>
                    지원일
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((application) => (
                  <tr key={application.id}>
                    <td className={styles.company}>{application.companyName}</td>
                    <td>{application.position}</td>
                    <td>
                      <Badge status={application.status} />
                    </td>
                    <td className={`${styles.dateCol} num`}>
                      {formatDate(application.appliedAt ?? application.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState compact icon="inbox" message="아직 등록된 지원 내역이 없습니다." />
          )}
        </Card>
      </PageState>
    </div>
  );
}
