import storage from "@/utils/storage";
import { createStateContext } from "react-use";

export const [useDoneTask, DoneTaskProvider] = createStateContext(false);
export const [useStorage, StorageProvider] = createStateContext(storage);
