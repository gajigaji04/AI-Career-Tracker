import { useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import styles from "./Header.module.css";

export default function Header() {
  const { data } = useMe();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <span className={styles.name}>{data?.data?.name}</span>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        로그아웃
      </button>
    </header>
  );
}
