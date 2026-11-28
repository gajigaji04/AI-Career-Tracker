import Badge from "../common/Badge";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { formatMinutes } from "../../utils/format";
import styles from "./StudyCard.module.css";

type Study = {
  id: string;
  title: string;
  content: string;
  category: string;
  studyTime: number;
  studyDate?: string;
};

type StudyCardProps = {
  study: Study;
  onEdit: (study: Study) => void;
  onDelete: (id: string) => void;
};

export default function StudyCard({ study, onEdit, onDelete }: StudyCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <Badge tone="info" dot={false}>
          {study.category}
        </Badge>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            icon="edit"
            aria-label={`${study.title} 수정`}
            title="수정"
            onClick={() => onEdit(study)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon="trash"
            aria-label={`${study.title} 삭제`}
            title="삭제"
            className={styles.deleteBtn}
            onClick={() => onDelete(study.id)}
          />
        </div>
      </div>
      <h3 className={styles.title}>{study.title}</h3>
      {study.content && <p className={styles.desc}>{study.content}</p>}
      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <Icon name="clock" size={14} />
          <span className="num">{formatMinutes(study.studyTime)}</span>
        </span>
        {study.studyDate && (
          <span className={styles.metaItem}>
            <Icon name="calendar" size={14} />
            <span className="num">{new Date(study.studyDate).toLocaleDateString("ko-KR")}</span>
          </span>
        )}
      </div>
    </article>
  );
}
