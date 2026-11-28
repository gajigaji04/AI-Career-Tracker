import type { ReactNode } from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "./ConfirmDialog.module.css";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  /** 무엇이 어떻게 되는지 (예: "토스 · 프론트엔드 개발자 지원 내역이 삭제됩니다.") */
  message: ReactNode;
  confirmLabel?: string;
  /** 진행 중이면 확인 버튼에 스피너를 보이고 중복 클릭을 막는다 */
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** 삭제처럼 되돌릴 수 없는 동작 전에 한 번 더 묻는 창 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "삭제",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className={styles.message}>{message}</p>
      <p className={styles.notice}>삭제한 내용은 되돌릴 수 없습니다.</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button variant="dangerSolid" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
