import { useState } from "react";
import {
  useStudies,
  useCreateStudy,
  useUpdateStudy,
  useDeleteStudy,
} from "../hooks/useStudies";

type Study = {
  id: string;
  title: string;
  content: string;
  category: string;
  studyTime: number;
};

export default function StudiesPage() {
  const { data, isLoading } = useStudies();
  const createStudy = useCreateStudy();
  const updateStudy = useUpdateStudy();
  const deleteStudy = useDeleteStudy();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("DEV");
  const [studyTime, setStudyTime] = useState(60);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editStudyTime, setEditStudyTime] = useState(0);

  if (isLoading) return <div>Loading...</div>;

  const startEdit = (study: Study) => {
    setEditingId(study.id);
    setEditTitle(study.title);
    setEditContent(study.content);
    setEditCategory(study.category);
    setEditStudyTime(study.studyTime);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: string) => {
    updateStudy.mutate(
      {
        id,
        data: {
          title: editTitle,
          content: editContent,
          category: editCategory,
          studyTime: editStudyTime,
        },
      },
      { onSuccess: () => setEditingId(null) }
    );
  };

  return (
    <div>
      <h1>Study</h1>

      {/* 추가 폼 */}
      <div>
        <input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          placeholder="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="공부 시간(분)"
          value={studyTime}
          onChange={(e) => setStudyTime(Number(e.target.value))}
        />
        <button
          onClick={() => {
            if (!title.trim()) return;
            createStudy.mutate(
              {
                title,
                content,
                category,
                studyTime,
                studyDate: new Date().toISOString(),
              },
              {
                onSuccess: () => {
                  setTitle("");
                  setContent("");
                  setCategory("DEV");
                  setStudyTime(60);
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
        {data?.data?.map((study: Study) =>
          editingId === study.id ? (
            <li key={study.id}>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              />
              <input
                type="number"
                value={editStudyTime}
                onChange={(e) => setEditStudyTime(Number(e.target.value))}
              />
              <button onClick={() => saveEdit(study.id)}>저장</button>
              <button onClick={cancelEdit}>취소</button>
            </li>
          ) : (
            <li key={study.id}>
              <strong>{study.title}</strong> — {study.content}
              <span> [{study.category} / {study.studyTime}분]</span>
              <button onClick={() => startEdit(study)}>수정</button>
              <button onClick={() => deleteStudy.mutate(study.id)}>삭제</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
