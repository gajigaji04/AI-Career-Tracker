import Badge from "../common/Badge";
import Button from "../common/Button";
import type { ApplicationStatus } from "../../api/application";
import styles from "./ApplicationCard.module.css";

type Application = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  memo?: string;
};

type ApplicationCardProps = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
};

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.company}>{application.companyName}</h3>
        <Badge status={application.status} />
      </div>
      <span className={styles.position}>{application.position}</span>
      {application.memo && <p className={styles.memo}>{application.memo}</p>}
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => onEdit(application)}>
          수정
        </Button>
        <Button variant="danger" onClick={() => onDelete(application.id)}>
          삭제
        </Button>
      </div>
    </div>
  );
}
