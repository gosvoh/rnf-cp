import getTasks from "@/utils/getTasks";
import TestPage from "./test";

export default function Test() {
  return <TestPage tasks={getTasks()} />;
}
