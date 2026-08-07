import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../common/Input";
import Button from "../common/Button";
import styles from "./ProjectForm.module.css";

const urlField = z
  .union([z.literal(""), z.string().url("올바른 URL 형식이 아닙니다.")])
  .optional();

const projectSchema = z.object({
  title: z.string().min(1, "프로젝트 이름을 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  techStack: z.string().min(1, "기술 스택을 입력해주세요."),
  githubUrl: urlField,
  deployUrl: urlField,
});

type ProjectFormValues = z.infer<typeof projectSchema>;
type ProjectFormData = {
  title: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  deployUrl?: string;
};

type ProjectFormProps = {
  onSubmit: (data: ProjectFormData) => void;
  onCancel?: () => void;
  initialData?: ProjectFormData;
};

export default function ProjectForm({ onSubmit, onCancel, initialData }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData ?? {
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      deployUrl: "",
    },
  });

  const submit = (values: ProjectFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description,
      techStack: values.techStack,
      githubUrl: values.githubUrl || undefined,
      deployUrl: values.deployUrl || undefined,
    });
  };

  return (
    <form noValidate className={styles.form} onSubmit={(e) => void handleSubmit(submit)(e)}>
      <Input
        label="프로젝트 이름"
        placeholder="프로젝트 이름"
        error={errors.title?.message}
        {...register("title")}
      />
      <Input
        label="설명"
        placeholder="프로젝트 설명"
        error={errors.description?.message}
        {...register("description")}
      />
      <Input
        label="기술 스택"
        placeholder="예: React, TypeScript, Node.js"
        error={errors.techStack?.message}
        {...register("techStack")}
      />
      <div className={styles.row}>
        <Input
          label="GitHub URL"
          placeholder="https://github.com/..."
          error={errors.githubUrl?.message}
          {...register("githubUrl")}
        />
        <Input
          label="배포 URL"
          placeholder="https://..."
          error={errors.deployUrl?.message}
          {...register("deployUrl")}
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
