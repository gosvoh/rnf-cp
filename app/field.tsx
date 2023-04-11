import TaskType from "@/types/task";
import styles from "./field.module.scss";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDoneTask } from "./customContext";

function addClassName(ref: HTMLDivElement, style: string) {
  ref.className = `${ref.className} ${style}`;
}

function removeClassName(ref: HTMLDivElement, style: string) {
  ref.className = ref.className.replace(style, "").trim();
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
  className,
}: {
  task: TaskType;
  type: "practice" | "test";
  className?: string;
}) {
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const centralObjectRef = useRef<HTMLDivElement>(null);
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const [consumedMolecules, setConsumedMolecules] = useState<string[]>([]);
  const [centralObject, setCentralObject] = useState<string>("Пробирка_пустая");
  const [done, setDone] = useDoneTask();

  let molecules: string[],
    correctCombination: string[],
    consumedObjects: string[] | undefined;
  if (type === "practice") {
    molecules = correctCombination = task.practice.combination;
    consumedObjects = task.practice.consumedObjects;
  } else {
    ({ molecules, correctCombination, consumedObjects } = task.test);
  }

  let lakmus = correctCombination.some((val) => val.includes("лакмус"));

  useEffect(() => {
    return () => {
      deselect();
      setConsumedMolecules([]);
    };
  }, []);

  useEffect(() => {
    deselect();
  }, [centralObject]);

  useEffect(() => {
    if (!done) return;
    blockField(true);
    if (centralObjectRef.current)
      addClassName(centralObjectRef.current, styles.done);
  }, [done]);

  useEffect(() => {
    if (type === "practice")
      setCentralObject(task.practice.centralObject ?? "Пробирка_пустая");
    if (type === "test") setCentralObject(task.test.centralObject);
    blockField(false);
    if (centralObjectRef.current)
      removeClassName(centralObjectRef.current, styles.done);
    return () => {
      deselect();
    };
  }, [task]);

  useEffect(() => {
    if (type === "practice")
      setCentralObject(task.practice.centralObject ?? "Пробирка_пустая");
    if (type === "test") setCentralObject(task.test.centralObject);
  }, [type]);

  useEffect(() => {
    if (!centralObjectRef.current) return;
    centralObjectRef.current.style.backgroundImage = `url("/assets/images/${centralObject}.png")`;
  }, [centralObject]);

  useEffect(() => {
    if (consumedMolecules.length === 0) return;

    if (consumedObjects)
      setCentralObject(
        consumedObjects.find((val) => {
          let el = consumedMolecules[0].split("_")[0];
          return val.includes(el);
        }) as string
      );
    else setCentralObject(consumedMolecules[0]);

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
    if (
      !event.currentTarget ||
      event.currentTarget.ariaDisabled === "true" ||
      consumedMolecules.includes(molecule) ||
      !centralObjectRef.current
    )
      return;

    if (lakmus) {
      const target = event.currentTarget;

      if (selectedRef.current && target !== selectedRef.current) {
        switchImage(
          selectedRef.current,
          correctCombination.find((val) =>
            val.toLowerCase().includes("лакмус")
          ) as string
        );
        removeClassName(selectedRef.current, styles.highlight);
        setDone(true);
        return;
      }

      if (!molecule.toLowerCase().includes("лакмус")) return;

      if (target.style.backgroundImage.toLowerCase().includes("лакмус_пачка")) {
        switchImage(target, "Лакмус_шт");
        return;
      }
      if (selectedRef.current) {
        removeClassName(target, styles.highlight);
        selectedRef.current = null;
      } else {
        addClassName(target, styles.highlight);
        selectedRef.current = target;
      }

      return;
    }

    if (correctCombination.length === 1) {
      setConsumedMolecules([...consumedMolecules, molecule]);
      return;
    }

    if (event.currentTarget === selectedRef.current) deselect();
    else {
      if (selectedRef.current) {
        removeClassName(selectedRef.current, styles.highlight);
        removeClassName(centralObjectRef.current, styles.highlight);
        switchImage(selectedRef.current, selectedMolecule as string);
      }

      selectedRef.current = event.currentTarget;
      switchImage(selectedRef.current, molecule);
      addClassName(selectedRef.current, styles.highlight);
      addClassName(centralObjectRef.current, styles.highlight);
      setSelectedMolecule(molecule);
    }
  }

  function blockField(block: boolean) {
    const elements = document.getElementsByClassName(styles.molecule);
    [...elements].forEach((el) => (el.ariaDisabled = block.toString()));
  }

  function deselect() {
    if (!selectedRef.current || !centralObjectRef.current || !selectedMolecule)
      return;

    removeClassName(selectedRef.current, styles.highlight);
    removeClassName(centralObjectRef.current, styles.highlight);

    switchImage(selectedRef.current, selectedMolecule);

    setSelectedMolecule(null);
    selectedRef.current = null;
  }

  function isDisabled(molecule: string) {
    let disabled = consumedMolecules.includes(molecule);
    return disabled;
  }

  function flaskClick() {
    if (!selectedMolecule || correctCombination.length === 1) return;

    setConsumedMolecules([...consumedMolecules, selectedMolecule]);
  }

  return (
    <div
      className={[styles.field, className].join(" ")}
      style={{
        gridTemplateRows: `repeat(${molecules.length / 2}, 1fr)`,
        gridTemplateColumns: `repeat(${lakmus ? 2 : 3}, 1fr)`,
      }}
    >
      {molecules.map((molecule) => {
        return (
          <div
            element={molecule}
            key={molecule}
            className={styles.molecule}
            aria-disabled={isDisabled(molecule)}
            onClick={(event) => select(event, molecule)}
            style={
              // TODO заменить background на Image
              colors.has(molecule)
                ? { backgroundColor: colors.get(molecule) }
                : {
                    backgroundImage: `url("/assets/images/${
                      molecule.toLowerCase().includes("лакмус")
                        ? "Лакмус_пачка"
                        : molecule
                    }.png")`,
                  }
            }
          ></div>
        );
      })}
      <div
        hidden={lakmus}
        element="центр"
        className={styles.flask}
        ref={centralObjectRef}
        onClick={flaskClick}
      ></div>
    </div>
  );
}
