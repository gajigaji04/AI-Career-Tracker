import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../common/Input";
import Button from "../common/Button";
import styles from "./StudyForm.module.css";

const studySchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  category: z.string().min(1, "카테고리를 입력해주세요."),
  studyTime: z
    .string()
    .min(1, "학습 시간을 입력해주세요.")
    .refine((v) => Number(v) > 0, "학습 시간은 0보다 커야 합니다."),
});

type StudyFormValues = z.infer<typeof studySchema>;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudyFormValues>({
    resolver: zodResolver(studySchema),
    defaultValues: initialData
      ? { ...initialData, studyTime: String(initialData.studyTime) }
      : { title: "", content: "", category: "", studyTime: "60" },
  });

  const submit = (values: StudyFormValues) => {
    onSubmit({ ...values, studyTime: Number(values.studyTime) });
  };

  return (
    <form noValidate className={styles.form} onSubmit={(e) => void handleSubmit(submit)(e)}>
      <Input
        label="제목"
        placeholder="학습 제목"
        error={errors.title?.message}
        {...register("title")}
      />
      <Input
        label="내용"
        placeholder="학습 내용"
        error={errors.content?.message}
        {...register("content")}
      />
      <div className={styles.row}>
        <Input
          label="카테고리"
          placeholder="예: Frontend"
          error={errors.category?.message}
          {...register("category")}
        />
        <Input
          label="학습 시간 (분)"
          type="number"
          placeholder="60"
          error={errors.studyTime?.message}
          {...register("studyTime")}
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
