import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import styles from "./LoginPage.module.css";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      navigate("/login", { state: { passwordReset: true } });
    } catch {
      setError("링크가 유효하지 않거나 만료됐습니다. 다시 요청해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>잘못된 접근입니다</h1>
            <p className={styles.subtitle}>재설정 링크가 유효하지 않습니다.</p>
          </div>
          <p className={styles.footer}>
            <Link to="/forgot-password" className={styles.link}>
              비밀번호 찾기 다시 요청하기
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>비밀번호 재설정</h1>
          <p className={styles.subtitle}>새로 사용할 비밀번호를 입력해주세요.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
          className={styles.form}
        >
          <div className={styles.field}>
            <label className={styles.label}>새 비밀번호</label>
            <input
              type="password"
              placeholder="8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>새 비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 재입력"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? <span className={styles.spinner} /> : "비밀번호 재설정"}
          </button>
        </form>

        <p className={styles.footer}>
          <Link to="/login" className={styles.link}>
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
