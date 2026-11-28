import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "../components/common/ConfirmDialog";
import PasswordInput from "../components/common/PasswordInput";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

describe("ConfirmDialog", () => {
  it("닫혀 있으면 아무것도 그리지 않는다", () => {
    render(
      <ConfirmDialog isOpen={false} title="삭제" message="메시지" onConfirm={vi.fn()} onClose={vi.fn()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("확인·취소·Esc 가 각각 onConfirm·onClose 를 부른다", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        title="프로젝트 삭제"
        message="이 프로젝트를 삭제할까요?"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("dialog", { name: "프로젝트 삭제" })).toBeInTheDocument();
    expect(screen.getByText("삭제한 내용은 되돌릴 수 없습니다.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "삭제" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "취소" }));
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("진행 중이면 확인·취소 버튼을 막아 중복 삭제를 막는다", () => {
    render(
      <ConfirmDialog isOpen loading title="삭제" message="메시지" onConfirm={vi.fn()} onClose={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: /삭제/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
  });
});

describe("PasswordInput", () => {
  it("표시 버튼으로 비밀번호를 보였다 숨긴다", async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="비밀번호" />);

    const input = screen.getByLabelText("비밀번호");
    expect(input).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "비밀번호 표시" }));
    expect(input).toHaveAttribute("type", "text");

    const hide = screen.getByRole("button", { name: "비밀번호 숨기기" });
    expect(hide).toHaveAttribute("aria-pressed", "true");
    await user.click(hide);
    expect(input).toHaveAttribute("type", "password");
  });
});

describe("Input", () => {
  it("라벨과 입력칸이 연결되고, 오류는 aria 로 읽힌다", () => {
    render(<Input label="이메일" error="올바른 이메일 형식을 입력해주세요." />);

    const input = screen.getByLabelText("이메일");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("올바른 이메일 형식을 입력해주세요.");
  });
});

describe("Button", () => {
  it("loading 이면 클릭을 막고 aria-busy 를 표시한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        저장
      </Button>,
    );

    const button = screen.getByRole("button", { name: /저장/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
