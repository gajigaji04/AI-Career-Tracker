import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/app/dashboard", label: "대시보드", icon: "🏠" },
  { to: "/app/studies", label: "학습 기록", icon: "📚" },
  { to: "/app/projects", label: "프로젝트", icon: "🗂️" },
  { to: "/app/applications", label: "지원 현황", icon: "📈" },
  { to: "/app/ai", label: "AI 도우미", icon: "✨" },
  { to: "/app/resumes", label: "이력서", icon: "📄" },
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
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.linkIcon} aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
