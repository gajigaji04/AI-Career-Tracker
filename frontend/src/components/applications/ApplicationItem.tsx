import Badge from "../common/Badge";
import Button from "../common/Button";
import type { ApplicationStatus } from "../../api/application";
import styles from "./ApplicationItem.module.css";

type Application = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  memo?: string;
};

type ApplicationItemProps = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
};

export default function ApplicationItem({ application, onEdit, onDelete }: ApplicationItemProps) {
  return (
    <li className={styles.item}>
      <span className={styles.company}>{application.companyName}</span>
      <span className={styles.position}>{application.position}</span>
      <Badge status={application.status} />
      <span />
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => onEdit(application)}>
          수정
        </Button>
        <Button variant="danger" onClick={() => onDelete(application.id)}>
          삭제
        </Button>
      </div>
      {application.memo && <span className={styles.memo}>{application.memo}</span>}
    </li>
  );
}
