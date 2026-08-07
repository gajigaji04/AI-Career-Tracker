import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../common/Input";
import Select from "../common/Select";
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

const applicationSchema = z.object({
  companyName: z.string().min(1, "회사명을 입력해주세요."),
  position: z.string().min(1, "포지션을 입력해주세요."),
  status: z.enum(["APPLIED", "DOCUMENT_PASS", "INTERVIEW", "FINAL_PASS", "REJECTED"]),
  memo: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: initialData ?? { companyName: "", position: "", status: "APPLIED", memo: "" },
  });

  const submit = (values: ApplicationFormValues) => {
    onFormSubmit({ ...values, memo: values.memo || undefined });
  };

  return (
    <form noValidate className={styles.form} onSubmit={(e) => void handleSubmit(submit)(e)}>
      <div className={styles.row}>
        <Input
          label="회사명"
          placeholder="회사명"
          error={errors.companyName?.message}
          {...register("companyName")}
        />
        <Input
          label="포지션"
          placeholder="포지션"
          error={errors.position?.message}
          {...register("position")}
        />
      </div>
      <Select label="상태" options={STATUS_OPTIONS} {...register("status")} />
      <Input
        label="메모"
        placeholder="메모 (선택)"
        error={errors.memo?.message}
        {...register("memo")}
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
