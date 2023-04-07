import TaskType from "@/types/task";
import styles from "./field.module.scss";
import { MutableRefObject, useEffect, useRef, useState } from "react";
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
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const centralObjectRef = useRef<HTMLDivElement>(null);
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const [consumedMolecules, setConsumedMolecules] = useState<string[]>([]);
  const [centralObject, setCentralObject] = useState<string>("Пробирка_пустая");
  const [done, setDone] = useDoneTask();

  let molecules: string[], correctCombination: string[];
  if (type === "practice")
    molecules = correctCombination = task.practice.combination;
  else ({ molecules, correctCombination } = task.test);

  useEffect(() => {
    setCentralObject(task.test.centralObject);
    return () => {
      deselect();
    };
  }, [task]);

  useEffect(() => {
    if (type === "practice") setCentralObject("Пробирка_пустая");
    else setCentralObject(task.test.centralObject);
  }, [type]);

  useEffect(() => {
    if (!centralObjectRef.current) return;
    centralObjectRef.current.style.backgroundImage = `url("/assets/images/${centralObject}.png")`;
  }, [centralObject]);

  useEffect(() => {
    if (consumedMolecules.length !== correctCombination.length) return;

    let done = false;
    if (consumedMolecules.every((value) => correctCombination.includes(value)))
      done = true;

    setConsumedMolecules([]);
    setCentralObject(task.test.centralObject);
    deselect();

    if (done) setDone(true);
  }, [consumedMolecules]);

  function select(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    molecule: string
  ) {
    if (!event.currentTarget || consumedMolecules.includes(molecule)) return;

    if (correctCombination.length === 1) {
      setConsumedMolecules([...consumedMolecules, molecule]);

      return;
    }

    if (event.currentTarget === selectedRef.current) deselect();
    else {
      if (selectedRef.current) {
        removeClassName(selectedRef, styles.highlight);
        switchImage(selectedRef.current, selectedMolecule as string);
      }

      selectedRef.current = event.currentTarget;
      switchImage(selectedRef.current, molecule);
      addClassName(selectedRef, styles.highlight);
      addClassName(centralObjectRef, styles.highlight);
      setSelectedMolecule(molecule);
    }
  }

  function deselect() {
    if (!selectedRef.current || !selectedMolecule) return;

    removeClassName(selectedRef, styles.highlight);
    removeClassName(centralObjectRef, styles.highlight);

    switchImage(selectedRef.current, selectedMolecule);

    setSelectedMolecule(null);
    selectedRef.current = null;
  }

  function flaskClick() {
    if (!selectedMolecule || correctCombination.length === 1) return;

    setCentralObject(selectedMolecule);
    setConsumedMolecules([...consumedMolecules, selectedMolecule]);
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
            aria-disabled={
              consumedMolecules.includes(molecule) && !colors.has(molecule)
            }
            onClick={(event) => select(event, molecule)}
            style={
              // TODO заменить background на Image
              colors.has(molecule)
                ? { backgroundColor: colors.get(molecule) }
                : { backgroundImage: `url("/assets/images/${molecule}.png")` }
            }
          ></div>
        );
      })}
      <div
        className={styles.flask}
        ref={centralObjectRef}
        onClick={flaskClick}
      ></div>
    </div>
  );
}
