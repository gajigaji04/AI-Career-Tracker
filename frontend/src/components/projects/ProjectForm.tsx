type ProjectFormProps = {
  onSubmit: (data: {
    title: string;
    description: string;
    techStack: string;
    githubUrl?: string;
    deployUrl?: string;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    title: string;
    description: string;
    techStack: string;
    githubUrl?: string;
    deployUrl?: string;
  };
};

export default function ProjectForm({ onSubmit, onCancel, initialData }: ProjectFormProps) {
  return (
    <form>
      {/* title, description, techStack, githubUrl, deployUrl 입력 필드 */}
      <button type="submit">{initialData ? "저장" : "추가"}</button>
      {onCancel && <button type="button" onClick={onCancel}>취소</button>}
    </form>
  );
}
