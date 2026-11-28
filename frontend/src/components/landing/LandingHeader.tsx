import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Icon from "../common/Icon";
import styles from "./LandingHeader.module.css";

export default function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">
            <Icon name="target" size={15} strokeWidth={2} />
          </span>
          CareerHub
        </Link>

        <nav className={styles.actions} aria-label="계정">
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
