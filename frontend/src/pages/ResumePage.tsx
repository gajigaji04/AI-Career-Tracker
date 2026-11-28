import { useRef, useState } from "react";
import { useResumes, useUploadResume, useDeleteResume } from "../hooks/useResume";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";
import PageState from "../components/common/PageState";
import Spinner from "../components/common/Spinner";
import Table from "../components/common/Table";
import type { Resume } from "../api/resume";
import styles from "./ResumePage.module.css";

export default function ResumePage() {
  const { data, isLoading, isError, refetch } = useResumes();
  const uploadResume = useUploadResume();
  const deleteResume = useDeleteResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resumes: Resume[] = data?.data ?? [];
  const latestVersion = resumes.reduce((max, r) => Math.max(max, r.version), 0);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    uploadResume.mutate(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="이력서"
        description="이력서 파일을 올리면 버전이 자동으로 매겨져 이전 버전과 함께 보관됩니다."
        actions={
          <Button icon="upload" onClick={openFilePicker} loading={uploadResume.isPending}>
            이력서 업로드
          </Button>
        }
      />

      {/* 드래그 앤 드롭 업로드 영역 (클릭·Enter·Space 로도 열림) */}
      <div
        role="button"
        tabIndex={0}
        aria-label="이력서 파일 선택 또는 끌어다 놓기"
        aria-disabled={uploadResume.isPending || undefined}
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFilePicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span className={styles.dropzoneIcon}>
          {uploadResume.isPending ? <Spinner size={20} /> : <Icon name="upload" size={20} />}
        </span>
        <p className={styles.dropzoneText}>
          {uploadResume.isPending ? (
            "업로드 중..."
          ) : (
            <>
              <strong>파일을 선택</strong>하거나 여기로 끌어다 놓으세요
            </>
          )}
        </p>
        <p className={styles.dropzoneHint}>PDF, DOC, DOCX · 최대 10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          accept=".pdf,.doc,.docx"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <PageState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <Card
          title="업로드한 이력서"
          description={resumes.length > 0 ? `총 ${resumes.length}개 버전` : undefined}
          padding="none"
        >
          {resumes.length === 0 ? (
            <EmptyState
              compact
              icon="fileText"
              title="업로드된 이력서가 없습니다"
              message="위 영역에 이력서 파일을 올려 첫 버전을 등록하세요."
            />
          ) : (
            <Table caption="이력서 버전 목록">
              <thead>
                <tr>
                  <th scope="col">버전</th>
                  <th scope="col">파일</th>
                  <th scope="col">업로드일</th>
                  <th scope="col" className={styles.actionCol}>
                    <span className="sr-only">관리</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume.id}>
                    <td className={styles.versionCell}>
                      <span className={`${styles.version} num`}>v{resume.version}</span>
                      {resume.version === latestVersion && (
                        <Badge tone="primary" dot={false}>
                          최신
                        </Badge>
                      )}
                    </td>
                    <td>
                      <span className={styles.fileName}>
                        <Icon name="fileText" size={16} className={styles.fileIcon} />
                        <span className={styles.fileNameText}>{resume.fileName}</span>
                      </span>
                    </td>
                    <td className={`${styles.date} num`}>
                      {new Date(resume.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className={styles.actionCol}>
                      <div className={styles.rowActions}>
                        <a
                          className={styles.viewLink}
                          href={resume.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          보기
                          <Icon name="externalLink" size={14} />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="trash"
                          aria-label={`${resume.fileName} v${resume.version} 삭제`}
                          title="삭제"
                          className={styles.deleteBtn}
                          onClick={() => deleteResume.mutate(resume.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </PageState>
    </div>
  );
}
