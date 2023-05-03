"use client";

import { useEffect, useState } from "react";
import Theory from "./theory";
import TaskType from "@/types/task";
import Practice from "./practice";
import { useDoneTask, useStorage } from "../customContext";
import { useRouter } from "next/navigation";
import storage from "@/utils/storage";

export default function PageClient({
  taskArray,
  index,
}: {
  taskArray: TaskType[];
  index: number;
}) {
  const [currentStep, setStep] = useState<"theory" | "practice">("theory");
  const [done, setDone] = useDoneTask();
  const router = useRouter();

  const task = taskArray[index];

  useEffect(() => {
    if (!task) return;

    const onMouseEvent = (ev: MouseEvent) => {
      let target: string | null = null;
      let HTMLTarget = ev.target as HTMLElement;
      if (HTMLTarget) {
        target = HTMLTarget.hasAttribute("element")
          ? HTMLTarget.getAttribute("element")
          : null;
      }
      storage.set(new Date().toISOString(), {
        page: "practice",
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

  useEffect(() => {
    if (!done) return;
    setDone(false);

    setTimeout(() => {
      if (taskArray[index + 1])
        router.push(`/${encodeURI(taskArray[index + 1].name)}`);
      else router.push("/logs");
    }, 5000);
  }, [done]);

  return (
    <>
      <p style={{ marginBottom: "1rem" }}>{`${index + 1}/${
        taskArray.length
      }`}</p>
      {currentStep === "theory" && task.video !== "__" ? (
        <Theory video={task.video} next={() => setStep("practice")} />
      ) : (
        <Practice task={task} />
      )}
    </>
  );
}
