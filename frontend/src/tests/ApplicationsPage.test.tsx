import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApplicationsPage from "../pages/ApplicationsPage";
import { ToastProvider } from "../components/common/Toast";
import * as applicationApi from "../api/application";

vi.mock("../api/application");

const APPLICATIONS = [
  { id: "a1", companyName: "네오테크", position: "프론트엔드 개발자", status: "INTERVIEW", memo: "2차 면접 준비", appliedAt: "2026-11-16T00:00:00.000Z" },
  { id: "a2", companyName: "블루웨이브", position: "웹 엔지니어", status: "DOCUMENT_PASS", memo: null, appliedAt: "2026-11-19T00:00:00.000Z" },
  { id: "a3", companyName: "스텔라소프트", position: "React 개발자", status: "FINAL_PASS", memo: "처우 협의 완료", appliedAt: "2026-10-29T00:00:00.000Z" },
];

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ApplicationsPage />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

const rowCompanies = () =>
  screen
    .getAllByRole("row")
    .slice(1) // 헤더 행 제외
    .map((row) => within(row).getAllByRole("cell")[0]!.textContent);

describe("ApplicationsPage - 검색·필터·보기 전환", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    vi.mocked(applicationApi.getApplications).mockResolvedValue({ success: true, data: APPLICATIONS });
  });

  it("검색어로 회사명·포지션·메모를 대소문자 구분 없이 거른다", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("네오테크");

    await user.type(screen.getByLabelText("지원 내역 검색"), "react");

    expect(rowCompanies()).toEqual(["스텔라소프트"]);
    expect(screen.getByText("1건")).toBeInTheDocument();
  });

  it("단계 필터를 누르면 그 단계만 보이고, 다시 누르면 전체로 돌아간다", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("네오테크");

    const filters = screen.getByRole("group", { name: "전형 단계 필터" });
    const interview = within(filters).getByRole("button", { name: /^면접/ });

    await user.click(interview);
    expect(interview).toHaveAttribute("aria-pressed", "true");
    expect(rowCompanies()).toEqual(["네오테크"]);

    await user.click(interview);
    expect(rowCompanies()).toHaveLength(3);
  });

  it("결과가 없으면 안내와 필터 초기화 버튼을 보여주고, 초기화하면 전체 목록으로 돌아간다", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("네오테크");

    await user.type(screen.getByLabelText("지원 내역 검색"), "없는회사");
    expect(screen.getByText("조건에 맞는 지원 내역이 없습니다")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    expect(rowCompanies()).toHaveLength(3);
    expect(screen.getByLabelText("지원 내역 검색")).toHaveValue("");
  });

  it("칸반 보기로 바꾸면 단계별 열이 보이고, 선택한 보기를 브라우저에 기억한다", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("네오테크");

    await user.click(screen.getByRole("button", { name: "칸반" }));

    expect(screen.getByRole("button", { name: "칸반" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    const interviewColumn = screen.getByRole("region", { name: "면접 단계" });
    expect(within(interviewColumn).getByText("네오테크")).toBeInTheDocument();
    expect(localStorage.getItem("careerhub.applications.view")).toBe("board");
  });

  it("지원 내역이 없으면 첫 지원 추가 안내를 보여준다", async () => {
    vi.mocked(applicationApi.getApplications).mockResolvedValue({ success: true, data: [] });
    renderPage();

    expect(await screen.findByText("아직 지원 내역이 없습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "첫 지원 추가" })).toBeInTheDocument();
  });
});

describe("ApplicationsPage - 삭제 확인", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    vi.mocked(applicationApi.getApplications).mockResolvedValue({ success: true, data: APPLICATIONS });
    vi.mocked(applicationApi.deleteApplication).mockResolvedValue({ success: true });
  });

  it("삭제 버튼을 누르면 확인창만 열리고, 취소하면 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("네오테크");

    await user.click(screen.getByRole("button", { name: "네오테크 프론트엔드 개발자 삭제" }));

    const dialog = screen.getByRole("dialog", { name: "지원 내역 삭제" });
    expect(within(dialog).getByText(/네오테크 · 프론트엔드 개발자/)).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "취소" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(applicationApi.deleteApplication).not.toHaveBeenCalled();
  });

  it("확인창에서 삭제를 누르면 해당 지원 내역 삭제 API를 호출하고 창을 닫는다", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("네오테크");

    await user.click(screen.getByRole("button", { name: "블루웨이브 웹 엔지니어 삭제" }));
    const dialog = screen.getByRole("dialog", { name: "지원 내역 삭제" });
    await user.click(within(dialog).getByRole("button", { name: "삭제" }));

    await waitFor(() => expect(applicationApi.deleteApplication).toHaveBeenCalledTimes(1));
    expect(vi.mocked(applicationApi.deleteApplication).mock.calls[0]![0]).toBe("a2");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
