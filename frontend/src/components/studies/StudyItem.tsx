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
    <li>
      <span>{study.title}</span>
      <button onClick={() => onEdit(study)}>수정</button>
      <button onClick={() => onDelete(study.id)}>삭제</button>
    </li>
  );
}
