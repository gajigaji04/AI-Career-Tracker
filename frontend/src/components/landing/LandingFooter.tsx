import { Link } from "react-router-dom";
import styles from "./LandingFooter.module.css";

export default function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            CareerHub
          </span>
          <p className={styles.tagline}>개발자 취업 준비 과정을 통합 관리하는 AI 커리어 관리 플랫폼</p>
        </div>

        <nav className={styles.links}>
          <Link to="/login" className={styles.link}>로그인</Link>
          <Link to="/register" className={styles.link}>회원가입</Link>
        </nav>
      </div>

      <p className={styles.copyright}>© 2026 CareerHub. All rights reserved.</p>
    </footer>
  );
}
