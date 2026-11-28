import { useMemo, useState } from "react";
import {
  useApplication,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "../hooks/useApplication";
import ApplicationForm from "../components/applications/ApplicationForm";
import ApplicationCard from "../components/applications/ApplicationCard";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import PageState from "../components/common/PageState";
import SegmentedControl from "../components/common/SegmentedControl";
import Table from "../components/common/Table";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABEL,
  formatDate,
} from "../constants/application";
import type { ApplicationItem } from "../constants/application";
import type { ApplicationStatus } from "../api/application";
import styles from "./ApplicationsPage.module.css";

type ViewMode = "table" | "board";
type StatusFilter = ApplicationStatus | "ALL";

const VIEW_STORAGE_KEY = "careerhub.applications.view";

// 보기 방식은 사용자 편의 설정이라 브라우저에만 기억한다. 저장소를 못 쓰면 표 보기로 시작.
const readViewMode = (): ViewMode => {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === "board" ? "board" : "table";
  } catch {
    return "table";
  }
};

export default function ApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplication();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationItem | null>(null);
  const [deletingApp, setDeletingApp] = useState<ApplicationItem | null>(null);
  const [view, setView] = useState<ViewMode>(readViewMode);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const applications: ApplicationItem[] = useMemo(() => data?.data ?? [], [data]);

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s, 0])) as Record<
      ApplicationStatus,
      number
    >;
    applications.forEach((a) => {
      counts[a.status] += 1;
    });
    return counts;
  }, [applications]);

  // 검색은 회사명·포지션·메모 대상, 대소문자 무시
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((a) =>
      [a.companyName, a.position, a.memo ?? ""].some((field) => field.toLowerCase().includes(q)),
    );
  }, [applications, query]);

  const filtered =
    statusFilter === "ALL" ? searched : searched.filter((a) => a.status === statusFilter);

  const isFiltering = query.trim() !== "" || statusFilter !== "ALL";

  const changeView = (next: ViewMode) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // 저장 실패는 무시 (보기 전환 자체는 동작)
    }
  };

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("ALL");
  };

  const handleEdit = (app: ApplicationItem) => setEditingApp(app);
  // 삭제는 확인창에서 한 번 더 확인한 뒤 실행
  const handleDelete = (id: string) =>
    setDeletingApp(applications.find((a) => a.id === id) ?? null);

  const renderTable = () => (
    <Card padding="none">
      <Table caption="지원 내역 목록">
        <thead>
          <tr>
            <th scope="col">회사</th>
            <th scope="col">포지션</th>
            <th scope="col">단계</th>
            <th scope="col" className={styles.memoCol}>
              메모
            </th>
            <th scope="col">지원일</th>
            <th scope="col" className={styles.actionCol}>
              <span className="sr-only">관리</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((app) => (
            <tr key={app.id}>
              <td className={styles.company}>{app.companyName}</td>
              <td>{app.position}</td>
              <td>
                <Badge status={app.status} />
              </td>
              <td className={styles.memoCol}>
                <span className={styles.memo}>{app.memo || "-"}</span>
              </td>
              <td className={`${styles.date} num`}>
                {formatDate(app.appliedAt ?? app.createdAt)}
              </td>
              <td className={styles.actionCol}>
                <div className={styles.rowActions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="edit"
                    aria-label={`${app.companyName} ${app.position} 수정`}
                    title="수정"
                    onClick={() => handleEdit(app)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="trash"
                    aria-label={`${app.companyName} ${app.position} 삭제`}
                    title="삭제"
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(app.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );

  // 칸반: 상태 필터가 걸려 있으면 그 단계 열만 보인다
  const renderBoard = () => {
    const columns = statusFilter === "ALL" ? APPLICATION_STATUSES : [statusFilter];
    return (
      <div className={styles.board}>
        {columns.map((status) => {
          const items = filtered.filter((a) => a.status === status);
          return (
            <section key={status} className={styles.column} aria-label={`${APPLICATION_STATUS_LABEL[status]} 단계`}>
              <header className={styles.columnHeader}>
                <Badge status={status} />
                <span className={`${styles.columnCount} num`}>{items.length}</span>
              </header>
              <div className={styles.columnBody}>
                {items.length > 0 ? (
                  items.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <p className={styles.columnEmpty}>해당 단계의 지원이 없습니다</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="지원 현황"
        description="지원한 회사와 전형 단계를 한곳에서 관리하세요."
        actions={
          <Button icon="plus" onClick={() => setIsAddOpen(true)}>
            지원 추가
          </Button>
        }
      />

      <PageState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        {applications.length === 0 ? (
          <Card>
            <EmptyState
              icon="briefcase"
              title="아직 지원 내역이 없습니다"
              message="지원한 회사를 추가하면 단계별로 진행 상황을 관리할 수 있습니다."
              action={
                <Button icon="plus" onClick={() => setIsAddOpen(true)}>
                  첫 지원 추가
                </Button>
              }
            />
          </Card>
        ) : (
          <>
            {/* 단계 필터: 단계별 건수를 함께 보여주는 파이프라인 요약 */}
            <div className={styles.pipeline} role="group" aria-label="전형 단계 필터">
              <button
                type="button"
                className={`${styles.stage} ${statusFilter === "ALL" ? styles.stageActive : ""}`}
                aria-pressed={statusFilter === "ALL"}
                onClick={() => setStatusFilter("ALL")}
              >
                <span className={styles.stageLabel}>전체</span>
                <span className={`${styles.stageCount} num`}>{applications.length}</span>
              </button>
              {APPLICATION_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`${styles.stage} ${styles[`stage_${status}`]} ${
                    statusFilter === status ? styles.stageActive : ""
                  }`}
                  aria-pressed={statusFilter === status}
                  onClick={() => setStatusFilter(statusFilter === status ? "ALL" : status)}
                >
                  <span className={styles.stageLabel}>{APPLICATION_STATUS_LABEL[status]}</span>
                  <span className={`${styles.stageCount} num`}>{statusCounts[status]}</span>
                </button>
              ))}
            </div>

            <div className={styles.toolbar}>
              <div className={styles.search}>
                <Input
                  type="search"
                  icon="search"
                  placeholder="회사명, 포지션, 메모 검색"
                  aria-label="지원 내역 검색"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className={styles.toolbarRight}>
                <span className={`${styles.resultCount} num`} aria-live="polite">
                  {filtered.length}건
                </span>
                <SegmentedControl
                  label="보기 방식"
                  value={view}
                  onChange={changeView}
                  options={[
                    { value: "table", label: "표", icon: "list" },
                    { value: "board", label: "칸반", icon: "kanban" },
                  ]}
                />
              </div>
            </div>

            {filtered.length === 0 && view === "table" ? (
              <Card>
                <EmptyState
                  compact
                  icon="search"
                  title="조건에 맞는 지원 내역이 없습니다"
                  message="검색어나 단계 필터를 바꿔보세요."
                  action={
                    isFiltering && (
                      <Button variant="secondary" size="sm" onClick={resetFilters}>
                        필터 초기화
                      </Button>
                    )
                  }
                />
              </Card>
            ) : view === "table" ? (
              renderTable()
            ) : (
              renderBoard()
            )}
          </>
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

      <ConfirmDialog
        isOpen={!!deletingApp}
        title="지원 내역 삭제"
        message={
          deletingApp && (
            <>
              <strong>
                {deletingApp.companyName} · {deletingApp.position}
              </strong>{" "}
              지원 내역을 삭제할까요? 이 지원으로 생성한 AI 기록도 함께 삭제됩니다.
            </>
          )
        }
        loading={deleteApplication.isPending}
        onClose={() => setDeletingApp(null)}
        onConfirm={() => {
          if (!deletingApp) return;
          deleteApplication.mutate(deletingApp.id, { onSettled: () => setDeletingApp(null) });
        }}
      />

      <Modal isOpen={!!editingApp} onClose={() => setEditingApp(null)} title="지원 내역 수정">
        {editingApp && (
          <ApplicationForm
            initialData={{
              companyName: editingApp.companyName,
              position: editingApp.position,
              status: editingApp.status,
              memo: editingApp.memo ?? undefined,
            }}
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
