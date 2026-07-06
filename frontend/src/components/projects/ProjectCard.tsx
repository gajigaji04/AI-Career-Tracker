import Button from "../common/Button";
import styles from "./ProjectCard.module.css";

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
  const tags = Array.isArray(project.techStack)
    ? project.techStack
    : project.techStack.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.desc}>{project.description}</p>
      {tags.length > 0 && (
        <div className={styles.stack}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      {(project.githubUrl || project.deployUrl) && (
        <div className={styles.links}>
          {project.githubUrl && (
            <a className={styles.link} href={project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {project.deployUrl && (
            <a className={styles.link} href={project.deployUrl} target="_blank" rel="noreferrer">
              배포
            </a>
          )}
        </div>
      )}
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => onEdit(project)}>
          수정
        </Button>
        <Button variant="danger" onClick={() => onDelete(project.id)}>
          삭제
        </Button>
      </div>
    </div>
  );
}
