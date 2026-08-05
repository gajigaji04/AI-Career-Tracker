import { useState } from "react";
import {
  useStudies,
  useCreateStudy,
  useUpdateStudy,
  useDeleteStudy,
} from "../hooks/useStudies";
import StudyForm from "../components/studies/StudyForm";
import StudyItem from "../components/studies/StudyItem";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import styles from "./StudiesPage.module.css";

type Study = {
  id: string;
  title: string;
  content: string;
  category: string;
  studyTime: number;
};

export default function StudiesPage() {
  const { data, isLoading } = useStudies();
  const createStudy = useCreateStudy();
  const updateStudy = useUpdateStudy();
  const deleteStudy = useDeleteStudy();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);

  if (isLoading) return <div>Loading...</div>;

  const studies: Study[] = data?.data ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>학습 기록</h1>
        <Button onClick={() => setIsAddOpen(true)}>+ 추가</Button>
      </div>

      {studies.length === 0 ? (
        <EmptyState icon="📚" message="아직 학습 기록이 없습니다." />
      ) : (
        <ul className={styles.list}>
          {studies.map((study) => (
            <StudyItem
              key={study.id}
              study={study}
              onEdit={setEditingStudy}
              onDelete={(id) => deleteStudy.mutate(id)}
            />
          ))}
        </ul>
      )}

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
