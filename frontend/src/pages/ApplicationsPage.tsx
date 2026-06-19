import { useState } from "react";
import { useApplication, useCreateApplication } from "../hooks/useApplication";

export default function ApplicationPage() {
  const { data, isLoading } = useApplication();
  const createApplication = useCreateApplication();

  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Applications</h1>

      {/* 입력 */}
      <div>
        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <button
          onClick={() => {
            createApplication.mutate({
              companyName,
              position,
              status: "APPLIED",
              appliedAt: new Date().toISOString(),
              memo: "",
            });

            setCompanyName("");
            setPosition("");
          }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul>
        {data?.data?.map((application: any) => (
          <li key={application.id}>
            <strong>{application.companyName}</strong>
            <br />
            {application.position} ({application.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
