import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#main-content">
        본문으로 건너뛰기
      </a>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className={styles.main}>
        <Header isMenuOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen(true)} />
        <main id="main-content" className={styles.content} tabIndex={-1}>
          <div className={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
