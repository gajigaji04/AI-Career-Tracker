type StudyFormProps = {
  onSubmit: (data: {
    title: string;
    content: string;
    category: string;
    studyTime: number;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    title: string;
    content: string;
    category: string;
    studyTime: number;
  };
};

export default function StudyForm({ onSubmit, onCancel, initialData }: StudyFormProps) {
  return (
    <form>
      {/* title, content, category, studyTime 입력 필드 */}
      <button type="submit">{initialData ? "저장" : "추가"}</button>
      {onCancel && <button type="button" onClick={onCancel}>취소</button>}
    </form>
  );
}
