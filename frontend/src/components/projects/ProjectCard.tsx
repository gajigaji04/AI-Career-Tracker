import Button from "../common/Button";
import Icon from "../common/Icon";
import styles from "./ProjectCard.module.css";
import type { Project } from "../../api/project";

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const tags = project.techStack;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            icon="edit"
            aria-label={`${project.title} 수정`}
            title="수정"
            onClick={() => onEdit(project)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon="trash"
            aria-label={`${project.title} 삭제`}
            title="삭제"
            className={styles.deleteBtn}
            onClick={() => onDelete(project.id)}
          />
        </div>
      </div>
      <p className={styles.desc}>{project.description}</p>
      {tags.length > 0 && (
        <ul className={styles.stack} aria-label="기술 스택">
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      {(project.githubUrl || project.deployUrl) && (
        <div className={styles.links}>
          {project.githubUrl && (
            <a className={styles.link} href={project.githubUrl} target="_blank" rel="noreferrer">
              <Icon name="github" size={14} />
              GitHub
            </a>
          )}
          {project.deployUrl && (
            <a className={styles.link} href={project.deployUrl} target="_blank" rel="noreferrer">
              <Icon name="externalLink" size={14} />
              배포
            </a>
          )}
        </div>
      )}
    </article>
  );
}
