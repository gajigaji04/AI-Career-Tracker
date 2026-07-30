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
import EmptyState from "../components/common/EmptyState";
import styles from "./ProjectsPage.module.css";
import type { Project } from "../api/project";

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  if (isLoading) return <div>Loading...</div>;

  const projects: Project[] = data?.data ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>프로젝트</h1>
        <Button onClick={() => setIsAddOpen(true)}>+ 추가</Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState message="아직 프로젝트가 없습니다." />
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditingProject}
              onDelete={(id) => deleteProject.mutate(id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="프로젝트 추가">
        <ProjectForm
          onSubmit={(formData) => {
            createProject.mutate(formData, { onSuccess: () => setIsAddOpen(false) });
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="프로젝트 수정"
      >
        {editingProject && (
          <ProjectForm
            initialData={{ ...editingProject, techStack: editingProject.techStack.join(", ") }}
            onSubmit={(formData) => {
              updateProject.mutate(
                { id: editingProject.id, data: formData },
                { onSuccess: () => setEditingProject(null) },
              );
            }}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </Modal>
    </div>
  );
}
