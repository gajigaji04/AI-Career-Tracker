import { useState } from "react";
import {
  useStudies,
  useCreateStudy,
  useUpdateStudy,
  useDeleteStudy,
} from "../hooks/useStudies";
import StudyForm from "../components/studies/StudyForm";
import StudyCard from "../components/studies/StudyCard";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";
import PageState from "../components/common/PageState";
import { formatMinutes } from "../utils/format";
import styles from "./StudiesPage.module.css";

type Study = {
  id: string;
  title: string;
  content: string;
  category: string;
  studyTime: number;
  studyDate?: string;
};

export default function StudiesPage() {
  const { data, isLoading, isError, refetch } = useStudies();
  const createStudy = useCreateStudy();
  const updateStudy = useUpdateStudy();
  const deleteStudy = useDeleteStudy();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [deletingStudy, setDeletingStudy] = useState<Study | null>(null);

  const studies: Study[] = data?.data ?? [];
  const totalMinutes = studies.reduce((sum, s) => sum + s.studyTime, 0);

  return (
    <div className={styles.page}>
      <PageHeader
        title="학습 기록"
        description={
          studies.length > 0
            ? `총 ${studies.length}건 · 누적 ${formatMinutes(totalMinutes)} 학습했어요.`
            : "공부한 내용을 기록하면 AI 도우미가 자소서·면접 준비에 활용합니다."
        }
        actions={
          <Button icon="plus" onClick={() => setIsAddOpen(true)}>
            학습 기록 추가
          </Button>
        }
      />

      <PageState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        {studies.length === 0 ? (
          <Card>
            <EmptyState
              icon="book"
              title="아직 학습 기록이 없습니다"
              message="오늘 공부한 내용을 짧게라도 남겨보세요."
              action={
                <Button icon="plus" onClick={() => setIsAddOpen(true)}>
                  첫 기록 추가
                </Button>
              }
            />
          </Card>
        ) : (
          <div className={styles.grid}>
            {studies.map((study) => (
              <StudyCard
                key={study.id}
                study={study}
                onEdit={setEditingStudy}
                onDelete={(id) => setDeletingStudy(studies.find((s) => s.id === id) ?? null)}
              />
            ))}
          </div>
        )}
      </PageState>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="학습 기록 추가">
        <StudyForm
          onSubmit={(formData) => {
            createStudy.mutate(
              { ...formData, studyDate: new Date().toISOString() },
              { onSuccess: () => setIsAddOpen(false) },
            );
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingStudy}
        title="학습 기록 삭제"
        message={
          deletingStudy && (
            <>
              <strong>{deletingStudy.title}</strong> 기록을 삭제할까요?
            </>
          )
        }
        loading={deleteStudy.isPending}
        onClose={() => setDeletingStudy(null)}
        onConfirm={() => {
          if (!deletingStudy) return;
          deleteStudy.mutate(deletingStudy.id, { onSettled: () => setDeletingStudy(null) });
        }}
      />

      <Modal
        isOpen={!!editingStudy}
        onClose={() => setEditingStudy(null)}
        title="학습 기록 수정"
      >
        {editingStudy && (
          <StudyForm
            initialData={editingStudy}
            onSubmit={(formData) => {
              updateStudy.mutate(
                { id: editingStudy.id, data: formData },
                { onSuccess: () => setEditingStudy(null) },
              );
            }}
            onCancel={() => setEditingStudy(null)}
          />
        )}
      </Modal>
    </div>
  );
}
