import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import styles from "./StudyForm.module.css";

type StudyFormData = {
  title: string;
  content: string;
  category: string;
  studyTime: number;
};

type StudyFormProps = {
  onSubmit: (data: StudyFormData) => void;
  onCancel?: () => void;
  initialData?: StudyFormData;
};

export default function StudyForm({ onSubmit, onCancel, initialData }: StudyFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [studyTime, setStudyTime] = useState(initialData?.studyTime ?? 60);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title, content, category, studyTime });
      }}
    >
      <Input
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="학습 제목"
      />
      <Input
        label="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="학습 내용"
      />
      <div className={styles.row}>
        <Input
          label="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="예: Frontend"
        />
        <Input
          label="학습 시간 (분)"
          type="number"
          value={String(studyTime)}
          onChange={(e) => setStudyTime(Number(e.target.value))}
          placeholder="60"
        />
      </div>
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button type="submit">{initialData ? "저장" : "추가"}</Button>
      </div>
    </form>
  );
}
