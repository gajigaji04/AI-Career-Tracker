import Icon from "../common/Icon";
import styles from "./Header.module.css";

type HeaderProps = {
  isMenuOpen: boolean;
  onMenuClick: () => void;
};

/** 모바일(≤768px) 전용 상단바. 데스크톱에서는 사이드바가 로고·계정을 맡는다. */
export default function Header({ isMenuOpen, onMenuClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        aria-controls="app-sidebar"
        aria-expanded={isMenuOpen}
      >
        <Icon name="menu" size={20} />
      </button>
      <span className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true">
          <Icon name="target" size={14} strokeWidth={2} />
        </span>
        CareerHub
      </span>
    </header>
  );
}
