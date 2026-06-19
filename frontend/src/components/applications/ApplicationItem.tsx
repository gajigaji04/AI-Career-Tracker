import Badge from "../common/Badge";
import type { ApplicationStatus } from "../../api/application";

type Application = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  memo?: string;
};

type ApplicationItemProps = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
};

export default function ApplicationItem({ application, onEdit, onDelete }: ApplicationItemProps) {
  return (
    <li>
      <strong>{application.companyName}</strong>
      <span>{application.position}</span>
      <Badge status={application.status} />
      {application.memo && <span>{application.memo}</span>}
      <button onClick={() => onEdit(application)}>수정</button>
      <button onClick={() => onDelete(application.id)}>삭제</button>
    </li>
  );
}
