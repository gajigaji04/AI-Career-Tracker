import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/router";
import { ToastProvider } from "./components/common/Toast";
// Pretendard: 가변 폰트를 유니코드 범위별 분할 파일(dynamic subset)로 불러온다. font-display: swap.
// 브라우저는 화면에 나온 글자가 속한 조각만 내려받는다.
// 고정 굵기 4개(400~700)보다 가변 1벌이 @font-face CSS(54→13 kB gzip)와 글자 조각 전송량 모두 작아서 가변을 쓴다.
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </QueryClientProvider>,
);
