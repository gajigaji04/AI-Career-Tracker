import Button from "../common/Button";
import styles from "./StudyCard.module.css";

type Study = {
  id: string;
  title: string;
  content: string;
  category: string;
  studyTime: number;
};

type StudyCardProps = {
  study: Study;
  onEdit: (study: Study) => void;
  onDelete: (id: string) => void;
};

export default function StudyCard({ study, onEdit, onDelete }: StudyCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{study.title}</h3>
      <span className={styles.meta}>
        {study.category} · {study.studyTime}분
      </span>
      {study.content && <p className={styles.desc}>{study.content}</p>}
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => onEdit(study)}>
          수정
        </Button>
        <Button variant="danger" onClick={() => onDelete(study.id)}>
          삭제
        </Button>
      </div>
    </div>
  );
}
