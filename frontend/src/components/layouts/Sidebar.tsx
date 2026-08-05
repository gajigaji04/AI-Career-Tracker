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

export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <span className={styles.logo}>
        <span className={styles.logoIcon}>✦</span>
        CareerHub
      </span>
      {NAV_ITEMS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
