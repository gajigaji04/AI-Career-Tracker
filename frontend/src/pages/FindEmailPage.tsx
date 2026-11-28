import { useState } from "react";
import { Link } from "react-router-dom";
import { requestFindEmail, verifyFindEmail } from "../api/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Input from "../components/common/Input";
import styles from "./LoginPage.module.css";

type Step = "phone" | "code" | "result";

const STEPS: { key: Step; label: string }[] = [
  { key: "phone", label: "휴대폰 번호" },
  { key: "code", label: "인증번호 확인" },
  { key: "result", label: "이메일 확인" },
];

export default function FindEmailPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestCode = async () => {
    setError("");
    setIsLoading(true);
    try {
      await requestFindEmail(phone);
      setStep("code");
    } catch {
      setError("인증번호 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    setIsLoading(true);
    try {
      const { data } = await verifyFindEmail(phone, code);
      setEmail(data.email);
      setStep("result");
    } catch {
      setError("인증번호가 올바르지 않거나 만료되었습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>아이디 찾기</h1>
          <p className={styles.subtitle}>
            {step === "result"
              ? "인증이 완료됐어요."
              : "가입하신 휴대폰 번호로 인증 후 이메일을 확인할 수 있어요."}
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <ol className={styles.steps} aria-label="진행 단계">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              className={`${styles.stepItem} ${i <= currentIndex ? styles.stepDone : ""}`}
              aria-current={i === currentIndex ? "step" : undefined}
            >
              <span className={`${styles.stepDot} num`}>
                {i < currentIndex ? <Icon name="check" size={12} strokeWidth={2.5} /> : i + 1}
              </span>
              {s.label}
            </li>
          ))}
        </ol>

        {step === "phone" && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void handleRequestCode();
            }}
            className={styles.form}
          >
            <Input
              large
              label="휴대폰 번호"
              type="tel"
              icon="phone"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {error && (
              <p className={styles.error} role="alert">
                <Icon name="alertCircle" size={16} />
                {error}
              </p>
            )}

            <Button type="submit" fullWidth loading={isLoading} className={styles.submit}>
              인증번호 받기
            </Button>
          </form>
        )}

        {step === "code" && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void handleVerifyCode();
            }}
            className={styles.form}
          >
            <p className={styles.success} role="status">
              <Icon name="checkCircle" size={16} />
              {phone}(으)로 인증번호를 발송했습니다. (5분 이내 입력)
            </p>

            <Input
              large
              label="인증번호"
              type="text"
              autoComplete="one-time-code"
              inputMode="numeric"
              placeholder="6자리 숫자"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
            />

            {error && (
              <p className={styles.error} role="alert">
                <Icon name="alertCircle" size={16} />
                {error}
              </p>
            )}

            <Button type="submit" fullWidth loading={isLoading} className={styles.submit}>
              확인
            </Button>
          </form>
        )}

        {step === "result" && (
          <div className={styles.result} role="status">
            <span className={styles.resultLabel}>가입된 이메일</span>
            <strong className={styles.resultValue}>{email}</strong>
          </div>
        )}

        <p className={styles.footer}>
          <Link to="/login" className={styles.link}>
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
