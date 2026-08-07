import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMe } from "../hooks/useMe";
import * as authApi from "../api/auth";

vi.mock("../api/auth");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useMe", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("로그인된 사용자 정보를 반환한다", async () => {
    const mockUser = {
      success: true,
      data: { id: "1", email: "test@example.com", name: "테스터" },
    };
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockUser);
  });

  it("인증되지 않은 경우 isError가 true가 된다", async () => {
    vi.mocked(authApi.getMe).mockRejectedValue(new Error("401"));

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
