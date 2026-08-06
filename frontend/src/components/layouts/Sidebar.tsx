import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/studies", label: "Studies" },
  { to: "/app/projects", label: "Projects" },
  { to: "/app/applications", label: "Applications" },
  { to: "/app/ai", label: "AI 도우미" },
  { to: "/app/resumes", label: "이력서" },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <span className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          CareerHub
        </span>
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
