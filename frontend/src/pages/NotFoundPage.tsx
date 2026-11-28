import { Link } from "react-router-dom";
import Icon from "../components/common/Icon";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <span className={styles.icon} aria-hidden="true">
        <Icon name="search" size={22} />
      </span>
      <p className={`${styles.code} num`}>404</p>
      <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
      <p className={styles.subtitle}>주소가 잘못됐거나, 더 이상 존재하지 않는 페이지예요.</p>
      <Link to="/" className={styles.link}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
