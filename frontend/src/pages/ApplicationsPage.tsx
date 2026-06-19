import { useState } from "react";
import {
  useApplication,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "../hooks/useApplication";
import type { ApplicationStatus } from "../api/application";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "APPLIED",
  "DOCUMENT_PASS",
  "INTERVIEW",
  "FINAL_PASS",
  "REJECTED",
];

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "지원",
  DOCUMENT_PASS: "서류통과",
  INTERVIEW: "면접",
  FINAL_PASS: "최종합격",
  REJECTED: "불합격",
};

type Application = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  memo: string;
};

export default function ApplicationPage() {
  const { data, isLoading } = useApplication();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("APPLIED");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editStatus, setEditStatus] = useState<ApplicationStatus>("APPLIED");
  const [editMemo, setEditMemo] = useState("");

  if (isLoading) return <div>Loading...</div>;

  const startEdit = (app: Application) => {
    setEditingId(app.id);
    setEditCompanyName(app.companyName);
    setEditPosition(app.position);
    setEditStatus(app.status);
    setEditMemo(app.memo ?? "");
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: string) => {
    updateApplication.mutate(
      {
        id,
        data: {
          companyName: editCompanyName,
          position: editPosition,
          status: editStatus,
          memo: editMemo,
        },
      },
      { onSuccess: () => setEditingId(null) }
    );
  };

  return (
    <div>
      <h1>Applications</h1>

      {/* 추가 폼 */}
      <div>
        <input
          placeholder="회사명"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <input
          placeholder="포지션"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (!companyName.trim() || !position.trim()) return;
            createApplication.mutate(
              {
                companyName,
                position,
                status,
                appliedAt: new Date().toISOString(),
                memo: "",
              },
              {
                onSuccess: () => {
                  setCompanyName("");
                  setPosition("");
                  setStatus("APPLIED");
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
        {data?.data?.map((app: Application) =>
          editingId === app.id ? (
            <li key={app.id}>
              <input
                value={editCompanyName}
                onChange={(e) => setEditCompanyName(e.target.value)}
              />
              <input
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
              />
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <input
                placeholder="메모"
                value={editMemo}
                onChange={(e) => setEditMemo(e.target.value)}
              />
              <button onClick={() => saveEdit(app.id)}>저장</button>
              <button onClick={cancelEdit}>취소</button>
            </li>
          ) : (
            <li key={app.id}>
              <strong>{app.companyName}</strong> — {app.position} ({STATUS_LABEL[app.status]})
              {app.memo && <span> | {app.memo}</span>}
              <button onClick={() => startEdit(app)}>수정</button>
              <button onClick={() => deleteApplication.mutate(app.id)}>삭제</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
