import type { ApplicationStatus } from "../../api/application";

type ApplicationFormProps = {
  onSubmit: (data: {
    companyName: string;
    position: string;
    status: ApplicationStatus;
    memo?: string;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    companyName: string;
    position: string;
    status: ApplicationStatus;
    memo?: string;
  };
};

export default function ApplicationForm({ onSubmit, onCancel, initialData }: ApplicationFormProps) {
  return (
    <form>
      {/* companyName, position, status(select), memo 입력 필드 */}
      <button type="submit">{initialData ? "저장" : "추가"}</button>
      {onCancel && <button type="button" onClick={onCancel}>취소</button>}
    </form>
  );
}
