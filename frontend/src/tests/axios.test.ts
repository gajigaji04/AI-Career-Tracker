import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError } from "axios";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { api, shouldSkipRefresh } from "../api/axios";

// 네트워크 대신 지정한 상태 코드로 응답하는 어댑터
const respondWith =
  (statusByUrl: Record<string, number>): AxiosAdapter =>
  async (config: InternalAxiosRequestConfig) => {
    const status = statusByUrl[config.url ?? ""] ?? 200;
    const response = { data: {}, status, statusText: "", headers: {}, config };
    if (status >= 400) {
      throw new AxiosError("error", String(status), config, null, response);
    }
    return response;
  };

describe("shouldSkipRefresh", () => {
  it("로그인 전 인증 엔드포인트는 refresh 대상에서 제외한다", () => {
    expect(shouldSkipRefresh("/auth/login")).toBe(true);
    expect(shouldSkipRefresh("/auth/register")).toBe(true);
    expect(shouldSkipRefresh("/auth/refresh")).toBe(true);
    expect(shouldSkipRefresh("/auth/find-email/verify")).toBe(true);
  });

  it("세션 복원(/auth/me)과 일반 API는 refresh 대상이다", () => {
    expect(shouldSkipRefresh("/auth/me")).toBe(false);
    expect(shouldSkipRefresh("/studies")).toBe(false);
    expect(shouldSkipRefresh(undefined)).toBe(false);
  });
});

describe("api 401 인터셉터", () => {
  const originalAdapter = api.defaults.adapter;
  let refreshSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    refreshSpy = vi.spyOn(axios, "post");
  });

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
    refreshSpy.mockRestore();
  });

  it("로그인 401은 refresh·리다이렉트 없이 그대로 에러를 반환한다 (로그인 페이지가 에러 메시지를 표시할 수 있게)", async () => {
    api.defaults.adapter = respondWith({ "/auth/login": 401 });

    await expect(api.post("/auth/login", {})).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it("일반 API 401은 refresh 후 원래 요청을 재시도한다", async () => {
    let calls = 0;
    api.defaults.adapter = async (config) => {
      calls += 1;
      const status = calls === 1 ? 401 : 200;
      const response = { data: { ok: true }, status, statusText: "", headers: {}, config };
      if (status === 401) throw new AxiosError("expired", "401", config, null, response);
      return response;
    };
    refreshSpy.mockResolvedValue({ status: 200 });

    const res = await api.get("/studies");

    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(refreshSpy.mock.calls[0]?.[0]).toMatch(/\/auth\/refresh$/);
    expect(res.status).toBe(200);
    expect(calls).toBe(2);
  });
});
