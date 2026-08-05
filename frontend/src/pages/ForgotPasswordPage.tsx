import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import styles from "./LoginPage.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await forgotPassword(email);
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>비밀번호 찾기</h1>
          <p className={styles.subtitle}>
            가입하신 이메일로 비밀번호 재설정 링크를 보내드릴게요.
          </p>
        </div>

        {submitted ? (
          <p className={styles.success}>
            입력하신 이메일이 가입되어 있다면, 재설정 링크를 발송했습니다. 메일함을 확인해주세요. (1시간 동안 유효)
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
            className={styles.form}
          >
            <div className={styles.field}>
              <label className={styles.label}>이메일</label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <span className={styles.spinner} /> : "재설정 링크 받기"}
            </button>
          </form>
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
