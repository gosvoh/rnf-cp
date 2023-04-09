import TaskType from "@/types/task";
import Field from "../field";

export default function Practice({ task }: { task: TaskType }) {
  return (
    <>
      <p style={{ marginBottom: "1rem" }}>{task.name}</p>
      <Field task={task} type="practice" />
    </>
  );
}
