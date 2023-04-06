"use client";

import { DoneTaskProvider, TaskIndexProvider } from "./customContext";
import styles from "./page.module.scss";

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TaskIndexProvider>
      <DoneTaskProvider>
        <main className={styles.main}>{children}</main>
      </DoneTaskProvider>
    </TaskIndexProvider>
  );
}
