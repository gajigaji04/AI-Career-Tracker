import { useState } from "react";
import { useProjects, useCreateProject } from "../hooks/useProject";

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const createProject = useCreateProject();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Projects</h1>

      {/* 입력 */}
      <div>
        <input
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={() => {
            createProject.mutate({
              title,
              description,
              github_Url: "",
              deploy_Url: "",
              techStack: "React, TypeScript",
            });

            setTitle("");
            setDescription("");
          }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul>
        {data?.data?.map((project: any) => (
          <li key={project.id}>
            <strong>{project.title}</strong>
            <br />
            {project.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
