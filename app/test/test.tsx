"use client";

import TaskType from "@/types/task";
import { useEffect, useState } from "react";
import Field from "../field";
import styles from "./page.module.scss";
import { useDoneTask } from "../customContext";
import { useRouter } from "next/navigation";
import storage from "@/utils/storage";

export default function TestPage({ tasks }: { tasks: TaskType[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [task, setTask] = useState<TaskType | undefined>(tasks[index]);
  const [done, setDone] = useDoneTask();

  useEffect(() => {
    if (!done) return;
    setTimeout(() => {
      setIndex(index + 1);
      setDone(false);
    }, 5000);
  }, [done]);

  useEffect(() => {
    setTask(tasks[index]);
  }, [index]);

  useEffect(() => {
    if (!task) {
      router.push("/logs");
      return;
    }

    const onMouseEvent = (ev: MouseEvent) => {
      let target: string | null = null;
      let HTMLTarget = ev.target as HTMLElement;
      if (HTMLTarget) {
        target = HTMLTarget.hasAttribute("element")
          ? HTMLTarget.getAttribute("element")
          : null;
      }
      storage.set(new Date().toISOString(), {
        page: "test",
        taskName: task?.name,
        screenX: ev.screenX,
        screenY: ev.screenY,
        target: target,
        event: ev.type,
      });
    };

    window.addEventListener("mousemove", onMouseEvent);
    window.addEventListener("mousedown", onMouseEvent);

    return () => {
      window.removeEventListener("mousemove", onMouseEvent);
      window.removeEventListener("mousedown", onMouseEvent);
    };
  }, [task]);

  const anyToJSON = (obj: any) => JSON.stringify(Object.fromEntries(obj));

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <p>
          {index + 1}/{tasks.length}
        </p>
        <p className={styles.task}>{task?.task}</p>
      </div>
      {task ? <Field className={styles.field} task={task} type="test" /> : null}
      <div className={styles.control}>
        <button
          onClick={() => (index === 0 ? router.back() : setIndex(index - 1))}
        >
          Back
        </button>
        <button onClick={() => setIndex(index + 1)}>Next</button>
      </div>
    </main>
  );
}
