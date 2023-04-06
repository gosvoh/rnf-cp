import TaskType from "@/types/task";
import styles from "./field.module.scss";
import { Dispatch, MutableRefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDoneTask } from "./customContext";

function addClassName(ref: MutableRefObject<any>, style: string) {
  ref.current.className = `${ref.current.className} ${style}`;
}

function removeClassName(ref: MutableRefObject<any>, style: string) {
  ref.current.className = ref.current.className.replace(style, "").trim();
}

function switchImage(element: HTMLDivElement, molecule: string) {
  const isDefault = element.style.backgroundImage.includes("_верт");
  if (isDefault) {
    const tmp = molecule.split("_");
    tmp[1] = "налив";
    element.style.backgroundImage = `url("/assets/images/${tmp.join(
      "_"
    )}.png")`;
  } else
    element.style.backgroundImage = `url("/assets/images/${molecule}.png")`;
}

// const colors = ["белый", "красный", "синий", "желтый", "розовый"];
// enum colors {
//   white = "белый",
//   red = "красный",
//   blue = "синий",
//   yellow = "желтый",
//   magenta = "розовый",
// }

const colors = new Map(
  Object.entries({
    белый: "white",
    красный: "red",
    синий: "blue",
    желтый: "yellow",
    розовый: "magenta",
  })
);

export default function Field({
  task,
  type,
}: {
  task: TaskType;
  type: "practice" | "test";
}) {
  const selRef = useRef<HTMLDivElement | null>(null);
  const centralRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [consumed, setConsumed] = useState<string[]>([]);
  const [centralObject, setCentralObject] = useState<string>("Пробирка_пустая");
  const [done, setDone] = useDoneTask();
  const [isColor, setIsColor] = useState(false);

  let molecules: string[], correctCombination: string[];
  if (type === "practice")
    molecules = correctCombination = task.practice.combination;
  else ({ molecules, correctCombination } = task.test);

  useEffect(() => {
    setCentralObject(task.test.centralObject);
    setIsColor(
      task.test.correctCombination.length === 1 &&
        colors.has(task.test.correctCombination[0])
    );
    return () => {
      deselect();
      setIsColor(false);
    };
  }, [task]);

  useEffect(() => {
    console.log(isColor);
  }, [isColor]);

  useEffect(() => {
    if (type === "practice") setCentralObject("Пробирка_пустая");
    else setCentralObject(task.test.centralObject);
  }, [type]);

  useEffect(() => {
    if (isColor) return;
    if (!selected) removeClassName(centralRef, styles.selectable);
    else if (!centralRef.current?.className.includes(styles.selectable))
      addClassName(centralRef, styles.selectable);
  }, [selected]);

  useEffect(() => {
    if (!centralRef.current) return;
    centralRef.current.style.backgroundImage = `url("/assets/images/${centralObject}.png")`;
  }, [centralObject]);

  useEffect(() => {
    if (consumed.length === 1) {
      if (selected && colors.has(selected))
        setDone(task.test.correctCombination.includes(selected));
      else setCentralObject(consumed[0]);
    }
    if (consumed.length !== 2) return;

    let done = false;
    if (consumed.every((value) => task.test.correctCombination.includes(value)))
      done = true;
    setConsumed([]);

    setCentralObject(task.test.centralObject);

    if (done) setDone(true);
  }, [consumed]);

  function select(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    molecule: string
  ) {
    if (!event.currentTarget || !molecule || consumed.includes(molecule))
      return;

    if (colors.has(molecule)) {
      setSelected(molecule);
      setConsumed([molecule]);
      return;
    }

    if (event.currentTarget === selRef.current) {
      removeClassName(selRef, styles.selected);
      switchImage(selRef.current, molecule);
      selRef.current = null;
      setSelected(null);
    } else {
      if (selRef.current) {
        switchImage(selRef.current, selected as string);
        removeClassName(selRef, styles.selected);
      }
      selRef.current = event.currentTarget;
      addClassName(selRef, styles.selected);
      switchImage(selRef.current, molecule);
      setSelected(molecule);
    }
  }

  function deselect() {
    if (!selRef.current || !selected) return;
    removeClassName(selRef, styles.selected);
    removeClassName(centralRef, styles.selectable);
    switchImage(selRef.current, selected);
    setSelected(null);
    selRef.current = null;
  }

  function flaskClick() {
    if (!selected || colors.has(selected)) return;

    setConsumed([...consumed, selected]);
    deselect();
  }

  return (
    <div
      className={styles.field}
      style={{
        gridTemplateRows: `repeat(${molecules.length / 2}, 1fr)`,
      }}
    >
      {molecules.map((molecule) => {
        return (
          <div
            key={molecule}
            className={styles.molecule}
            aria-disabled={consumed.includes(molecule) && !colors.has(molecule)}
            onClick={(event) => select(event, molecule)}
            style={
              colors.has(molecule)
                ? { backgroundColor: colors.get(molecule) }
                : { backgroundImage: `url("/assets/images/${molecule}.png")` }
            }
          ></div>
        );
      })}
      <div className={styles.flask} ref={centralRef} onClick={flaskClick}></div>
    </div>
  );
}
