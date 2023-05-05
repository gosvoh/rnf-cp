import Link from "next/link";
import styles from "./page.module.scss";
import { tasksArray } from "@/utils/getTasks";

export default function Home() {
  return (
    <main className={styles.main}>
      <ul className={styles.tasks}>
        {tasksArray.map((value) => {
          return (
            <li key={value.name}>
              <Link href={`/${value.name}`} prefetch={false}>
                {value.name}
              </Link>
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
