import { useMe } from "../hooks/useMe";

export default function DashboardPage() {
  const { data, isLoading } = useMe();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        안녕하세요
        {data.data.name}님
      </h1>

      <p>{data.data.email}</p>
    </div>
  );
}
