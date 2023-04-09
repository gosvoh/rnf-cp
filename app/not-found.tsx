import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2>Страница не найдена!</h2>
      <Link href={"/"}>На главную</Link>
    </div>
  );
}
