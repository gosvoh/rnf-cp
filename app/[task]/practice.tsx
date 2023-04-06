import TaskType from "@/types/task";
import Field from "./field";

export default function Practice({ task }: { task: TaskType }) {
  return (
    <>
      <div>
        <p>{task.name}</p>
        <p>{task.task}</p>
      </div>
      <Field task={task} type="practice" />
    </>
  );
}
