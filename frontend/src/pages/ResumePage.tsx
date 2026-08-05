import { useRef, useState } from "react";
import { useResumes, useUploadResume, useDeleteResume } from "../hooks/useResume";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import type { Resume } from "../api/resume";
import styles from "./ResumePage.module.css";

export default function ResumePage() {
  const { data, isLoading } = useResumes();
  const uploadResume = useUploadResume();
  const deleteResume = useDeleteResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resumes: Resume[] = data?.data ?? [];

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    uploadResume.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>이력서 관리</h1>
      </div>

      {/* 드래그 앤 드롭 업로드 영역 */}
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span className={styles.dropzoneIcon}>📄</span>
        <p className={styles.dropzoneText}>클릭하거나 파일을 드래그하여 업로드</p>
        <p className={styles.dropzoneHint}>PDF, DOC, DOCX · 최대 10MB · 버전이 자동으로 관리됩니다</p>
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {uploadResume.isPending && (
        <div className={styles.uploading}>
          <div className={styles.spinner} />
          업로드 중...
        </div>
      )}

      {/* 이력서 목록 */}
      {resumes.length === 0 ? (
        <EmptyState icon="📄" message="업로드된 이력서가 없습니다." />
      ) : (
        <div className={styles.list}>
          {resumes.map((resume) => (
            <div key={resume.id} className={styles.item}>
              <span className={styles.versionBadge}>v{resume.version}</span>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{resume.fileName}</span>
                <span className={styles.fileDate}>
                  {new Date(resume.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </div>
              <div className={styles.actions}>
                <a
                  className={styles.downloadLink}
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  보기
                </a>
                <Button
                  variant="danger"
                  onClick={() => deleteResume.mutate(resume.id)}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
