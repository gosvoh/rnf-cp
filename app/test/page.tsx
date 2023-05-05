import { tasksArray } from "@/utils/getTasks";
import TestPage from "./test";

export default function Test() {
  return <TestPage tasks={tasksArray} />;
}
