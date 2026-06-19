type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string | string[];
  githubUrl?: string;
  deployUrl?: string;
};

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <span>{Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack}</span>
      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
      {project.deployUrl && <a href={project.deployUrl} target="_blank" rel="noreferrer">배포</a>}
      <button onClick={() => onEdit(project)}>수정</button>
      <button onClick={() => onDelete(project.id)}>삭제</button>
    </div>
  );
}
