import { useState } from "react";
import {
  useApplication,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "../hooks/useApplication";
import ApplicationForm from "../components/applications/ApplicationForm";
import ApplicationCard from "../components/applications/ApplicationCard";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import PageState from "../components/common/PageState";
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
  const { data, isLoading, isError } = useApplication();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const applications: Application[] = data?.data ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>지원 현황</h1>
        <Button onClick={() => setIsAddOpen(true)}>+ 추가</Button>
      </div>

      <PageState isLoading={isLoading} isError={isError}>
        {applications.length === 0 ? (
          <EmptyState icon="📈" message="아직 지원 내역이 없습니다." />
        ) : (
          <div className={styles.grid}>
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={setEditingApp}
                onDelete={(id) => deleteApplication.mutate(id)}
              />
            ))}
          </div>
        )}
      </PageState>

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
