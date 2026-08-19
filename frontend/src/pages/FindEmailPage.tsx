import { useState } from "react";
import { Link } from "react-router-dom";
import { requestFindEmail, verifyFindEmail } from "../api/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import styles from "./LoginPage.module.css";

type Step = "phone" | "code" | "result";

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

        {step === "phone" && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void handleRequestCode();
            }}
            className={styles.form}
          >
            <div className={styles.field}>
              <label className={styles.label}>휴대폰 번호</label>
              <input
                type="tel"
                placeholder="01012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <span className={styles.spinner} /> : "인증번호 받기"}
            </button>
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
            <p className={styles.success}>
              {phone}(으)로 인증번호를 발송했습니다. (5분 이내 입력)
            </p>

            <div className={styles.field}>
              <label className={styles.label}>인증번호</label>
              <input
                type="text"
                placeholder="6자리 숫자"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.input}
                maxLength={6}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <span className={styles.spinner} /> : "확인"}
            </button>
          </form>
        )}

        {step === "result" && (
          <p className={styles.success}>
            회원님의 이메일은 <strong>{email}</strong> 입니다.
          </p>
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
