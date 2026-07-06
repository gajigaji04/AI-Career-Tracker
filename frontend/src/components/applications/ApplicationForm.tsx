import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import type { ApplicationStatus } from "../../api/application";
import styles from "./ApplicationForm.module.css";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "APPLIED", label: "지원" },
  { value: "DOCUMENT_PASS", label: "서류통과" },
  { value: "INTERVIEW", label: "면접" },
  { value: "FINAL_PASS", label: "최종합격" },
  { value: "REJECTED", label: "불합격" },
];

type ApplicationFormData = {
  companyName: string;
  position: string;
  status: ApplicationStatus;
  memo?: string;
};

type ApplicationFormProps = {
  onSubmit: (data: ApplicationFormData) => void;
  onCancel?: () => void;
  initialData?: ApplicationFormData;
};

export default function ApplicationForm({
  onSubmit: onFormSubmit,
  onCancel,
  initialData,
}: ApplicationFormProps) {
  const [companyName, setCompanyName] = useState(initialData?.companyName ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [status, setStatus] = useState<ApplicationStatus>(initialData?.status ?? "APPLIED");
  const [memo, setMemo] = useState(initialData?.memo ?? "");

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!companyName.trim() || !position.trim()) return;
        onFormSubmit({ companyName, position, status, memo: memo || undefined });
      }}
    >
      <div className={styles.row}>
        <Input
          label="회사명"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="회사명"
        />
        <Input
          label="포지션"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="포지션"
        />
      </div>
      <div>
        <label className={styles.selectLabel}>상태</label>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="메모"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="메모 (선택)"
      />
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
