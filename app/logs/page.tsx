"use client";

import Link from "next/link";
import storage from "@/utils/storage";
import { useEffect } from "react";
import styles from "./page.module.scss";

export default function Logs() {
  const anyToJSON = (obj: any) => JSON.stringify(Object.fromEntries(obj));

  useEffect(() => {
    return () => {
      storage.clear();
    };
  }, []);

  return (
    <main className={styles.main}>
      <Link
        href={URL.createObjectURL(
          new Blob([anyToJSON(storage)], { type: "application/json" })
        )}
        download={`${new Date().toISOString()}.json`}
        target="_blank"
      >
        Скачать логи
      </Link>
      <Link href={"/"}>На главную</Link>
    </main>
  );
}
