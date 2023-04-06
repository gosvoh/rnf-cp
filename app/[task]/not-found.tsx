import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2>Задание не найдено!</h2>
      <Link href={"/"}>На главную</Link>
    </div>
  );
}
