import TaskType from "@/types/task";
import { readFileSync, readdirSync } from "fs";
import naturalSort from "typescript-natural-sort";

export default function getTasks() {
  const dirPath = "./tasks/";
  const fileNames = readdirSync(dirPath).sort(naturalSort);
  const ret: TaskType[] = [];
  fileNames.forEach((name) =>
    ret.push(JSON.parse(readFileSync(dirPath + name, "utf-8")))
  );
  return ret;
}

export const tasksArray = getTasks();

export let currentTask: TaskType;
export const setCurrentTask = (task: TaskType) => (currentTask = task);
