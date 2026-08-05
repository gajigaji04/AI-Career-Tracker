import { useState } from "react";
import {
  useApplication,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "../hooks/useApplication";
import ApplicationForm from "../components/applications/ApplicationForm";
import ApplicationItem from "../components/applications/ApplicationItem";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import type { ApplicationStatus } from "../api/application";
import styles from "./ApplicationsPage.module.css";

type Application = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  memo?: string;
};

export default function ApplicationsPage() {
  const { data, isLoading } = useApplication();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  if (isLoading) return <div>Loading...</div>;

  const applications: Application[] = data?.data ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>지원 현황</h1>
        <Button onClick={() => setIsAddOpen(true)}>+ 추가</Button>
      </div>

      {applications.length === 0 ? (
        <EmptyState icon="📈" message="아직 지원 내역이 없습니다." />
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>회사명</span>
            <span>포지션</span>
            <span>상태</span>
            <span />
            <span />
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {applications.map((app) => (
              <ApplicationItem
                key={app.id}
                application={app}
                onEdit={setEditingApp}
                onDelete={(id) => deleteApplication.mutate(id)}
              />
            ))}
          </ul>
        </div>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="지원 내역 추가">
        <ApplicationForm
          onSubmit={(formData) => {
            createApplication.mutate(
              { ...formData, appliedAt: new Date().toISOString() },
              { onSuccess: () => setIsAddOpen(false) },
            );
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        title="지원 내역 수정"
      >
        {editingApp && (
          <ApplicationForm
            initialData={editingApp}
            onSubmit={(formData) => {
              updateApplication.mutate(
                { id: editingApp.id, data: formData },
                { onSuccess: () => setEditingApp(null) },
              );
            }}
            onCancel={() => setEditingApp(null)}
          />
        )}
      </Modal>
    </div>
  );
}
