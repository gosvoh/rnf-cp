"use client";

import { DoneTaskProvider, StorageProvider } from "../customContext";
import styles from "./page.module.scss";
export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StorageProvider>
      <DoneTaskProvider>
        <main className={styles.main}>{children}</main>
      </DoneTaskProvider>
    </StorageProvider>
  );
}
