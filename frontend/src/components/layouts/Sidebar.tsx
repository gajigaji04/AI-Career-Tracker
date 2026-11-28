import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { logout } from "../../api/auth";
import Icon from "../common/Icon";
import { NAV_GROUPS } from "./navItems";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data } = useMe();
  const navigate = useNavigate();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const name = data?.data?.name?.trim();
  const email = data?.data?.email;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 모바일 서랍: 열리면 닫기 버튼으로 포커스, Esc 로 닫기
  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}
      <aside
        id="app-sidebar"
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        aria-label="주 메뉴"
      >
        <div className={styles.top}>
          <span className={styles.logo}>
            <span className={styles.logoMark} aria-hidden="true">
              <Icon name="target" size={16} strokeWidth={2} />
            </span>
            CareerHub
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className={styles.group}>
              <p className={styles.groupLabel}>{group.label}</p>
              <ul className={styles.list}>
                {group.items.map(({ to, label, icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `${styles.link} ${isActive ? styles.active : ""}`
                      }
                    >
                      <Icon name={icon} size={18} className={styles.linkIcon} />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.account}>
          <span className={styles.avatar} aria-hidden="true">
            {name?.charAt(0) ?? "?"}
          </span>
          <div className={styles.accountText}>
            <span className={styles.accountName}>{name}</span>
            {email && <span className={styles.accountEmail}>{email}</span>}
          </div>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
            aria-label="로그아웃"
            title="로그아웃"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
