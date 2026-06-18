import { useState } from "react";
import { useStudies, useCreateStudy } from "../hooks/useStudies";

export default function StudiesPage() {
  const { data, isLoading } = useStudies();
  const createStudy = useCreateStudy();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Study</h1>

      {/* 입력 */}
      <div>
        <input
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={() => {
            createStudy.mutate({
              title,
              content,
              category: "DEV",
              studyTime: 60,
              studyDate: new Date().toISOString(),
            });

            setTitle("");
            setContent("");
          }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul>
        {data?.data?.map((study: any) => (
          <li key={study.id}>
            {study.title} - {study.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
