import { useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { logout } from "../../api/auth";
import styles from "./Header.module.css";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const { data } = useMe();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="메뉴 열기">
        ☰
      </button>
      <div className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">
          {data?.data?.name?.trim().charAt(0) ?? "?"}
        </span>
        <span className={styles.name}>{data?.data?.name}</span>
      </div>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        로그아웃
      </button>
    </header>
  );
}
