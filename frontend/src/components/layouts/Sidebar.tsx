import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/studies", label: "Studies" },
  { to: "/projects", label: "Projects" },
  { to: "/applications", label: "Applications" },
];

export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <span className={styles.logo}>AI CareerHub</span>
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
