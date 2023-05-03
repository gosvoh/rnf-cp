import TaskType from "@/types/task";
import Field from "../field";

export default function Practice({ task }: { task: TaskType }) {
  return <Field task={task} type="practice" />;
}
