import { createStateContext } from "react-use";

export const [useDoneTask, DoneTaskProvider] = createStateContext(false);
export const [useTaskIndex, TaskIndexProvider] = createStateContext(0);
