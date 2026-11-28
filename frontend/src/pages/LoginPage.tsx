import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
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
          <p className={styles.subtitle}>다시 오신 걸 환영해요. 계정 정보를 입력해주세요.</p>
        </div>

        {justRegistered && (
          <p className={styles.success} role="status">
            <Icon name="checkCircle" size={16} />
            회원가입이 완료됐습니다. 로그인해주세요.
          </p>
        )}
        {justResetPassword && (
          <p className={styles.success} role="status">
            <Icon name="checkCircle" size={16} />
            비밀번호가 재설정됐습니다. 새 비밀번호로 로그인해주세요.
          </p>
        )}

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
          className={styles.form}
        >
          <Input
            large
            label="이메일"
            type="email"
            icon="mail"
            autoComplete="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            large
            label="비밀번호"
            icon="lock"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.helperLinks}>
            <Link to="/find-email" className={styles.forgotLink}>
              아이디 찾기
            </Link>
            <span className={styles.helperDivider} aria-hidden="true" />
            <Link to="/forgot-password" className={styles.forgotLink}>
              비밀번호 찾기
            </Link>
          </div>

          {error && (
            <p className={styles.error} role="alert">
              <Icon name="alertCircle" size={16} />
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={isLoading} className={styles.submit}>
            로그인
          </Button>
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
