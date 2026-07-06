import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import styles from "./ProjectForm.module.css";

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
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [techStack, setTechStack] = useState(initialData?.techStack ?? "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl ?? "");
  const [deployUrl, setDeployUrl] = useState(initialData?.deployUrl ?? "");

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
          title,
          description,
          techStack,
          githubUrl: githubUrl || undefined,
          deployUrl: deployUrl || undefined,
        });
      }}
    >
      <Input
        label="프로젝트 이름"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="프로젝트 이름"
      />
      <Input
        label="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="프로젝트 설명"
      />
      <Input
        label="기술 스택"
        value={techStack}
        onChange={(e) => setTechStack(e.target.value)}
        placeholder="예: React, TypeScript, Node.js"
      />
      <div className={styles.row}>
        <Input
          label="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/..."
        />
        <Input
          label="배포 URL"
          value={deployUrl}
          onChange={(e) => setDeployUrl(e.target.value)}
          placeholder="https://..."
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
