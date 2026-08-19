import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { registered?: boolean; passwordReset?: boolean } | null;
  const justRegistered = Boolean(state?.registered);
  const justResetPassword = Boolean(state?.passwordReset);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/app/dashboard");
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>다시 오신 걸 환영해요.</p>
        </div>

        {justRegistered && (
          <p className={styles.success}>회원가입이 완료됐습니다. 로그인해주세요.</p>
        )}
        {justResetPassword && (
          <p className={styles.success}>비밀번호가 재설정됐습니다. 새 비밀번호로 로그인해주세요.</p>
        )}

        <form
          noValidate
          onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}
          className={styles.form}
        >
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>이메일</label>
              <Link to="/find-email" className={styles.forgotLink}>
                아이디 찾기
              </Link>
            </div>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>비밀번호</label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                비밀번호 찾기
              </Link>
            </div>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? <span className={styles.spinner} /> : "로그인"}
          </button>
        </form>

        <p className={styles.footer}>
          아직 계정이 없으신가요?{" "}
          <Link to="/register" className={styles.link}>
            회원가입
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
