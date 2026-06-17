import { useDashboard } from "../hooks/useDashboard";
import { useMe } from "../hooks/useMe";

export default function DashboardPage() {
  const { data: meData } = useMe();
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h1>
        안녕하세요
        {meData?.data?.name}님
      </h1>

      <p>{meData?.data?.email}</p>

      <h2>
        학습 기록:
        {data?.data?.studies}
      </h2>

      <h2>
        프로젝트:
        {data?.data?.projects}
      </h2>

      <h2>
        지원 현황:
        {data?.data?.applications}
      </h2>
    </div>
  );
}
