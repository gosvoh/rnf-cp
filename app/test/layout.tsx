"use client";

import { DoneTaskProvider } from "../[task]/customContext";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DoneTaskProvider>{children}</DoneTaskProvider>;
}
