import getTasks, { setCurrentTask, tasksArray } from "@/utils/getTasks";
import { notFound } from "next/navigation";
import PageClient from "./page.client";
import TaskType from "@/types/task";

export default function Task({ params }: { params: { task: string } }) {
  params.task = decodeURI(params.task);
  // const task = getTasks().find((value) => value.name === params.task);
  const taskList = (tasksArray[Symbol.iterator] = () => {
    let i = 0;
    return {
      next() {
        return {
          value: tasksArray[i++],
          done: tasksArray[i] == undefined ? true : false,
        };
      },
      current() {
        return tasksArray[i];
      },
      [Symbol.iterator]: function () {
        return this;
      },
    };
  })();
  let res = taskList.next();
  while (!res.done) {
    if (res.value.name === params.task) break;
    res = taskList.next();
  }

  if (!res.value) notFound();

  return <PageClient taskList={taskList} />;
}

// TODO
// 1 этап - перенос элементов
// 2 этап - показ видео

// Отдельная страница - тестовая часть
