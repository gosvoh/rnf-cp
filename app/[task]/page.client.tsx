"use client";

import { useEffect, useState } from "react";
import Theory from "./theory";
import TaskType from "@/types/task";
import Practice from "./practice";
import storage from "@/utils/storage";
import { DoneTaskProvider, useDoneTask } from "./customContext";

export default function PageClient({
  taskList,
}: {
  taskList: {
    next(): {
      value: TaskType;
      done: boolean;
    };
    current(): TaskType;
    [Symbol.iterator]: () => IterableIterator<TaskType>;
  };
}) {
  const [currentStep, setStep] = useState<"theory" | "practice">("theory");
  const [done, setDone] = useDoneTask();

  const task = taskList.current();

  useEffect(() => {
    console.log("Page client", done);
    if (done) setDone(false);
  }, [done]);

  if (currentStep === "theory")
    return <Theory video={task.video} next={() => setStep("practice")} />;
  else return <Practice task={task} />;
}
