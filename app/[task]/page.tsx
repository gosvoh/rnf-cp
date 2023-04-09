import { tasksArray } from "@/utils/getTasks";
import { notFound } from "next/navigation";
import PageClient from "./page.client";
import Logs from "./logs";

export default function Task({ params }: { params: { task: string } }) {
  params.task = decodeURI(params.task);
  let index = tasksArray.findIndex((val) => val.name === params.task);

  if (params.task === "logs") return <Logs />;

  if (!tasksArray[index]) notFound();

  return <PageClient taskArray={tasksArray} index={index} />;
}
