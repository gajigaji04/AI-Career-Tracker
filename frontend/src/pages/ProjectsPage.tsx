import { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProject";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";
import PageState from "../components/common/PageState";
import styles from "./ProjectsPage.module.css";
import type { Project } from "../api/project";

export default function ProjectsPage() {
  const { data, isLoading, isError, refetch } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const projects: Project[] = data?.data ?? [];

  return (
    <div className={styles.page}>
      <PageHeader
        title="프로젝트"
        description={
          projects.length > 0
            ? `총 ${projects.length}개 프로젝트`
            : "진행한 프로젝트와 기술 스택을 정리하면 AI 도우미가 자소서·면접 준비에 활용합니다."
        }
        actions={
          <Button icon="plus" onClick={() => setIsAddOpen(true)}>
            프로젝트 추가
          </Button>
        }
      />

      <PageState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        {projects.length === 0 ? (
          <Card>
            <EmptyState
              icon="folder"
              title="아직 프로젝트가 없습니다"
              message="진행한 프로젝트를 추가해 포트폴리오를 정리하세요."
              action={
                <Button icon="plus" onClick={() => setIsAddOpen(true)}>
                  첫 프로젝트 추가
                </Button>
              }
            />
          </Card>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setEditingProject}
                onDelete={(id) => setDeletingProject(projects.find((p) => p.id === id) ?? null)}
              />
            ))}
          </div>
        )}
      </PageState>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="프로젝트 추가"
      >
        <ProjectForm
          onSubmit={(formData) => {
            createProject.mutate(formData, {
              onSuccess: () => setIsAddOpen(false),
            });
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingProject}
        title="프로젝트 삭제"
        message={
          deletingProject && (
            <>
              <strong>{deletingProject.title}</strong> 프로젝트를 삭제할까요?
            </>
          )
        }
        loading={deleteProject.isPending}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => {
          if (!deletingProject) return;
          deleteProject.mutate(deletingProject.id, { onSettled: () => setDeletingProject(null) });
        }}
      />

      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="프로젝트 수정"
      >
        {editingProject && (
          <ProjectForm
            initialData={{
              ...editingProject,
              techStack: editingProject.techStack.join(", "),
            }}
            onSubmit={(formData) => {
              updateProject.mutate(
                {
                  id: editingProject.id,
                  data: formData,
                },
                {
                  onSuccess: () => setEditingProject(null),
                },
              );
            }}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </Modal>
    </div>
  );
}
