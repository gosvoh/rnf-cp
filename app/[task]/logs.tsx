"use client";

import Link from "next/link";
import storage from "@/utils/storage";

export default function Logs() {
  const anyToJSON = (obj: any) => JSON.stringify(Object.fromEntries(obj));

  return (
    <>
      <Link
        href={URL.createObjectURL(
          new Blob([anyToJSON(storage)], { type: "application/json" })
        )}
        download={`${new Date().toISOString()}.json`}
        target="_blank"
      >
        Скачать логи
      </Link>
      <Link href={"/"} onClick={storage.clear}>
        На главную
      </Link>
    </>
  );
}
