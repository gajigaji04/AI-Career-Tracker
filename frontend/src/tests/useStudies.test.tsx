import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useStudies } from "../hooks/useStudies";
import * as studyApi from "../api/study";

vi.mock("../api/study");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useStudies", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("성공 시 학습 기록 목록을 반환한다", async () => {
    const mockData = { success: true, data: [{ id: "1", title: "TS 공부" }] };
    vi.mocked(studyApi.getStudies).mockResolvedValue(mockData);

    const { result } = renderHook(() => useStudies(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(studyApi.getStudies).toHaveBeenCalledTimes(1);
  });

  it("API 실패 시 isError가 true가 된다", async () => {
    vi.mocked(studyApi.getStudies).mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useStudies(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
