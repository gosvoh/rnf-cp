import Link from "next/link";
import styles from "./page.module.scss";
import getTasks from "@/utils/getTasks";

export default function Home() {
  const tasks = getTasks();

  return (
    <main className={styles.main}>
      <ul className={styles.tasks}>
        {tasks.map((value) => {
          return (
            <li key={value.name}>
              <Link href={`/${value.name}`}>{value.name}</Link>
            </li>
          );
        })}
        <li>
          <Link href={"/test"}>Тест</Link>
        </li>
      </ul>
    </main>
  );
}
