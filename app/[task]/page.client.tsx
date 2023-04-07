"use client";

import { useEffect, useState } from "react";
import Theory from "./theory";
import TaskType from "@/types/task";
import Practice from "./practice";
import storage from "@/utils/storage";
import { useDoneTask } from "./customContext";
import { useRouter } from "next/navigation";

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
    if (!done) return;
    setDone(false);
    router.push(`/${encodeURI(taskArray[index + 1].name)}`);
  }, [done]);

  if (currentStep === "theory" && task.video !== "__")
    return <Theory video={task.video} next={() => setStep("practice")} />;
  else return <Practice task={task} />;
}
