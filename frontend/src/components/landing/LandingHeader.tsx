import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import styles from "./LandingHeader.module.css";

export default function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          CareerHub
        </span>

        <nav className={styles.actions}>
          <Link to="/login" className={styles.loginLink}>
            로그인
          </Link>
          <Button variant="primary" onClick={() => navigate("/register")}>
            무료 시작하기
          </Button>
        </nav>
      </div>
    </header>
  );
}
