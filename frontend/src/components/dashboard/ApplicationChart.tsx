import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./ApplicationChart.module.css";

type ChartData = {
  status: string;
  count: number;
};

type ApplicationChartProps = {
  data: ChartData[];
};

export default function ApplicationChart({ data }: ApplicationChartProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>지원 현황</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
