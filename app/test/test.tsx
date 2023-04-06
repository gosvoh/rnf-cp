"use client";

import TaskType from "@/types/task";
import Link from "next/link";
import { useEffect, useState } from "react";
import Field from "../[task]/field";
import styles from "./page.module.scss";
import { useDoneTask } from "../[task]/customContext";

export default function TestPage({ tasks }: { tasks: TaskType[] }) {
  const [index, setIndex] = useState(0);
  const [task, setTask] = useState<TaskType | undefined>(tasks[index]);
  const [done, setDone] = useDoneTask();

  useEffect(() => {
    if (!done) return;
    setIndex(index + 1);
    setDone(false);
  }, [done]);

  useEffect(() => {
    setTask(tasks[index]);
  }, [index]);

  if (!task)
    return (
      <main className={styles.main}>
        <p>Done</p>
        <Link href={"/"}>На главную</Link>
      </main>
    );
  return (
    <main className={styles.main}>
      <div>
        <p>{task.name}</p>
        <p>{task.task}</p>
      </div>
      <Field task={task} type="test" />
      <button onClick={() => setIndex(index + 1)}>Next</button>
    </main>
  );
}
