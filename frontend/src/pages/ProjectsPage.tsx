import { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProject";

type Project = {
  id: string;
  title: string;
  description: string;
  github_Url: string;
  deploy_Url: string;
  techStack: string;
};

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTechStack, setEditTechStack] = useState("");
  const [editGithubUrl, setEditGithubUrl] = useState("");
  const [editDeployUrl, setEditDeployUrl] = useState("");

  if (isLoading) return <div>Loading...</div>;

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditTechStack(project.techStack);
    setEditGithubUrl(project.github_Url ?? "");
    setEditDeployUrl(project.deploy_Url ?? "");
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: string) => {
    updateProject.mutate(
      {
        id,
        data: {
          title: editTitle,
          description: editDescription,
          techStack: editTechStack,
          github_Url: editGithubUrl,
          deploy_Url: editDeployUrl,
        },
      },
      { onSuccess: () => setEditingId(null) }
    );
  };

  return (
    <div>
      <h1>Projects</h1>

      {/* 추가 폼 */}
      <div>
        <input
          placeholder="프로젝트 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="기술 스택"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
        />
        <input
          placeholder="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
        <input
          placeholder="배포 URL"
          value={deployUrl}
          onChange={(e) => setDeployUrl(e.target.value)}
        />
        <button
          onClick={() => {
            if (!title.trim()) return;
            createProject.mutate(
              {
                title,
                description,
                techStack,
                github_Url: githubUrl,
                deploy_Url: deployUrl,
              },
              {
                onSuccess: () => {
                  setTitle("");
                  setDescription("");
                  setTechStack("");
                  setGithubUrl("");
                  setDeployUrl("");
                },
              }
            );
          }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul>
        {data?.data?.map((project: Project) =>
          editingId === project.id ? (
            <li key={project.id}>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <input
                value={editTechStack}
                onChange={(e) => setEditTechStack(e.target.value)}
              />
              <input
                placeholder="GitHub URL"
                value={editGithubUrl}
                onChange={(e) => setEditGithubUrl(e.target.value)}
              />
              <input
                placeholder="배포 URL"
                value={editDeployUrl}
                onChange={(e) => setEditDeployUrl(e.target.value)}
              />
              <button onClick={() => saveEdit(project.id)}>저장</button>
              <button onClick={cancelEdit}>취소</button>
            </li>
          ) : (
            <li key={project.id}>
              <strong>{project.title}</strong> — {project.description}
              <span> [{project.techStack}]</span>
              {project.github_Url && <span> | GitHub: {project.github_Url}</span>}
              {project.deploy_Url && <span> | 배포: {project.deploy_Url}</span>}
              <button onClick={() => startEdit(project)}>수정</button>
              <button onClick={() => deleteProject.mutate(project.id)}>삭제</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
