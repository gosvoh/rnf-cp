"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Reset</button>
      <button onClick={router.back}>Назад</button>
    </>
  );
}
