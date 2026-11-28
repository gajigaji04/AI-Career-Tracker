import type { ApplicationStatus } from "../../api/application";
import { APPLICATION_STATUS_LABEL } from "../../constants/application";
import styles from "./ApplicationChart.module.css";

type ChartData = {
  status: ApplicationStatus;
  count: number;
};

type ApplicationChartProps = {
  data: ChartData[];
};

/**
 * 전형 단계별 지원 분포 (가로 막대).
 * 숫자를 막대 옆에 같이 써서 색 없이도 읽히고, 차트 라이브러리 없이 CSS 로 그린다.
 */
export default function ApplicationChart({ data }: ApplicationChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className={styles.chart}>
      {/* 전체 비율 한 줄 요약 */}
      <div className={styles.stack} aria-hidden="true">
        {data.map((d) =>
          d.count > 0 ? (
            <span
              key={d.status}
              className={`${styles.segment} ${styles[d.status]}`}
              style={{ flexGrow: d.count }}
            />
          ) : null,
        )}
      </div>

      <dl className={styles.rows}>
        {data.map((d) => {
          const percent = total > 0 ? Math.round((d.count / total) * 100) : 0;
          return (
            <div key={d.status} className={styles.row}>
              <dt className={styles.label}>
                <span className={`${styles.swatch} ${styles[d.status]}`} aria-hidden="true" />
                {APPLICATION_STATUS_LABEL[d.status]}
              </dt>
              <dd className={styles.barCell}>
                <span className={styles.track} aria-hidden="true">
                  <span
                    className={`${styles.bar} ${styles[d.status]}`}
                    style={{ transform: `scaleX(${d.count / max})` }}
                  />
                </span>
                <span className={`${styles.count} num`}>
                  {d.count}건 <span className={styles.percent}>({percent}%)</span>
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
