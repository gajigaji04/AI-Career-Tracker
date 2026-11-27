import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  withCredentials: true,
});

// 401 이 "토큰 만료"가 아니라 요청 자체의 실패를 뜻하는 엔드포인트.
// 여기서 refresh → /login 리다이렉트를 하면 로그인 실패 메시지가 새로고침으로 사라진다.
// (/auth/me 는 세션 복원용이라 만료 시 refresh 대상이므로 제외하지 않는다)
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/find-email",
];

export const shouldSkipRefresh = (url?: string) =>
  !!url && NO_REFRESH_PATHS.some((path) => url.startsWith(path));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch {
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
