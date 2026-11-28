import Button from "../common/Button";
import Icon from "../common/Icon";
import { formatDate } from "../../constants/application";
import type { ApplicationItem } from "../../constants/application";
import styles from "./ApplicationCard.module.css";

type ApplicationCardProps = {
  application: ApplicationItem;
  onEdit: (application: ApplicationItem) => void;
  onDelete: (id: string) => void;
};

/** 칸반 보기의 지원 카드. 단계는 열이 나타내므로 배지를 따로 두지 않는다. */
export default function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  const label = `${application.companyName} ${application.position}`;

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <h3 className={styles.company}>{application.companyName}</h3>
        <p className={styles.position}>{application.position}</p>
        {application.memo && <p className={styles.memo}>{application.memo}</p>}
      </div>
      <div className={styles.footer}>
        <span className={`${styles.date} num`}>
          <Icon name="calendar" size={13} />
          {formatDate(application.appliedAt ?? application.createdAt)}
        </span>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            icon="edit"
            aria-label={`${label} 수정`}
            title="수정"
            onClick={() => onEdit(application)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon="trash"
            aria-label={`${label} 삭제`}
            title="삭제"
            className={styles.deleteBtn}
            onClick={() => onDelete(application.id)}
          />
        </div>
      </div>
    </article>
  );
}
