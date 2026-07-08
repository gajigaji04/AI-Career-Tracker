import Button from "../common/Button";
import styles from "./StudyItem.module.css";

type Study = {
  id: string;
  title: string;
  content: string;
  category: string;
  studyTime: number;
};

type StudyItemProps = {
  study: Study;
  onEdit: (study: Study) => void;
  onDelete: (id: string) => void;
};

export default function StudyItem({ study, onEdit, onDelete }: StudyItemProps) {
  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <span className={styles.title}>{study.title}</span>
        <span className={styles.meta}>
          {study.category} · {study.studyTime}분
        </span>
        {study.content && <span className={styles.meta}>{study.content}</span>}
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => onEdit(study)}>
          수정
        </Button>
        <Button variant="danger" onClick={() => onDelete(study.id)}>
          삭제
        </Button>
      </div>
    </li>
  );
}
