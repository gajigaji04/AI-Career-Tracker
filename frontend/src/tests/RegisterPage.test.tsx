import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import * as authApi from "../api/auth";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api/auth");

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>, overrides?: {
  email?: string;
  password?: string;
  passwordConfirm?: string;
}) {
  await user.type(
    screen.getByPlaceholderText("example@email.com"),
    overrides?.email ?? "test@example.com",
  );
  await user.type(
    screen.getByPlaceholderText("8자 이상"),
    overrides?.password ?? "password1234",
  );
  await user.type(
    screen.getByPlaceholderText("비밀번호 재입력"),
    overrides?.passwordConfirm ?? "password1234",
  );
  await user.type(screen.getByPlaceholderText("홍길동"), "테스터");
  await user.type(screen.getByPlaceholderText("다른 사용자에게 보일 이름"), "닉네임");
}

describe("RegisterPage - 유효성 검증", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("잘못된 이메일 형식이면 에러 메시지를 보여주고 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user, { email: "invalid-email" });
    await user.click(screen.getByRole("button", { name: "회원가입" }));

    expect(await screen.findByText("올바른 이메일 형식을 입력해주세요.")).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("비밀번호가 8자 미만이면 에러 메시지를 보여준다", async () => {
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user, { password: "123", passwordConfirm: "123" });
    await user.click(screen.getByRole("button", { name: "회원가입" }));

    expect(
      await screen.findByText("비밀번호는 8자 이상이어야 합니다."),
    ).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("비밀번호와 비밀번호 확인이 다르면 에러 메시지를 보여준다", async () => {
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user, { passwordConfirm: "differentpassword" });
    await user.click(screen.getByRole("button", { name: "회원가입" }));

    expect(await screen.findByText("비밀번호가 일치하지 않습니다.")).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("유효한 입력이면 register API를 호출하고 로그인 페이지로 이동한다", async () => {
    vi.mocked(authApi.register).mockResolvedValue({ success: true, data: {} });
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "회원가입" }));

    await waitFor(() =>
      expect(authApi.register).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          name: "테스터",
          nickname: "닉네임",
        }),
      ),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login", { state: { registered: true } });
  });

  it("API가 실패하면(이메일 중복 등) 에러 메시지를 보여준다", async () => {
    vi.mocked(authApi.register).mockRejectedValue(new Error("Conflict"));
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "회원가입" }));

    expect(
      await screen.findByText("이미 사용 중인 이메일이거나 요청 처리 중 오류가 발생했습니다."),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
