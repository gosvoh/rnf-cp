import TaskType from "@/types/task";
import styles from "./field.module.scss";
import { useEffect, useRef, useState } from "react";
import { useDoneTask } from "./customContext";

function addClassName(ref: HTMLDivElement, style: string) {
  ref.className = `${ref.className} ${style}`;
}

function removeClassName(ref: HTMLDivElement, style: string) {
  ref.className = ref.className.replace(style, "").trim();
}

function switchImage(element: HTMLDivElement, molecule: string) {
  const isDefault = decodeURIComponent(element.style.backgroundImage).includes(
    "_верт"
  );
  if (isDefault) {
    const tmp = molecule.split("_");
    tmp[1] = "налив";
    element.style.backgroundImage = `url("/assets/images/${encodeURIComponent(
      tmp.join("_")
    )}.png")`;
  } else
    element.style.backgroundImage = `url("/assets/images/${encodeURIComponent(
      molecule
    )}.png")`;
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
  const [centralObject, setCentralObject] = useState<string | null>(
    "Пробирка_пустая"
  );
  const [done, setDone] = useDoneTask();
  const [isBlocked, setIsBlocked] = useState(false);

  let molecules: string[],
    correctCombination: string[],
    consumedObjects: string[] | undefined;
  if (type === "practice") {
    molecules = correctCombination = task.practice.combination;
    consumedObjects = task.practice.consumedObjects;
  } else {
    ({ molecules, correctCombination, consumedObjects } = task.test);
  }

  let lakmus = correctCombination.some((val) =>
    val.toLowerCase().includes("лакмус")
  );

  useEffect(() => {
    return () => {
      deselect();
      setConsumedMolecules([]);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    setIsBlocked(true);
    if (centralObjectRef.current)
      centralObjectRef.current.innerHTML = `<p>${
        ["Молодец", "Отлично", "Так держать"][Math.ceil(Math.random() * 2)]
      }</p>`;
  }, [done]);

  useEffect(() => {
    if (type === "practice")
      setCentralObject(
        task.practice.centralObject ??
          task.practice.finalObject ??
          "Пробирка_пустая"
      );
    if (type === "test") setCentralObject(task.test.centralObject);
    setIsBlocked(false);
    if (centralObjectRef.current)
      removeClassName(centralObjectRef.current, styles.done);
    return () => {
      deselect();
      if (centralObjectRef.current) centralObjectRef.current.innerHTML = "";
    };
  }, [task]);

  useEffect(() => {
    if (type === "practice")
      setCentralObject(task.practice.centralObject ?? "Пробирка_пустая");
    if (type === "test") setCentralObject(task.test.centralObject);
  }, [type]);

  useEffect(() => {
    if (!centralObjectRef.current) return;
    if (!centralObject) {
      centralObjectRef.current.style.backgroundImage = "";
      return;
    }
    centralObjectRef.current.style.backgroundImage = `url("/assets/images/${encodeURIComponent(
      centralObject
    )}.png")`;
  }, [centralObject]);

  useEffect(() => {
    if (consumedMolecules.length === 0) return;

    if (consumedObjects) {
      const found = consumedObjects.find((val) => {
        let el = consumedMolecules[0].split("_")[0];
        return val.includes(el);
      }) as string;
      if (found) setCentralObject(found);
      else setCentralObject(consumedMolecules[0]);
    } else setCentralObject(consumedMolecules[0]);

    if (consumedMolecules.length !== correctCombination.length) {
      deselect();
      return;
    }

    let done = false;
    if (consumedMolecules.every((value) => correctCombination.includes(value)))
      done = true;

    setConsumedMolecules([]);
    deselect();

    if (done) {
      setDone(true);
      if (type === "practice")
        setCentralObject(task.practice.finalObject ?? task.test.centralObject);
      else setCentralObject(task.test.centralObject);
    } else {
      setIsBlocked(true);
      if (!centralObjectRef.current) return;
      addClassName(centralObjectRef.current, styles.wrong);
      setCentralObject(null);
      centralObjectRef.current.innerHTML = `<p>${
        ["Попробуй ещё раз", "Давай ещё раз", "Неверно"][
          Math.round(Math.random() * 2)
        ]
      }</p>`;

      setTimeout(() => {
        setIsBlocked(false);
        if (!centralObjectRef.current) return;
        removeClassName(centralObjectRef.current, styles.wrong);
        setCentralObject(task.test.centralObject);
        centralObjectRef.current.innerHTML = "";
      }, 5000);
    }
  }, [consumedMolecules]);

  function select(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    molecule: string
  ) {
    if (
      !event.currentTarget ||
      event.currentTarget.ariaDisabled === "true" ||
      consumedMolecules.includes(molecule)
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

      if (
        decodeURIComponent(target.style.backgroundImage)
          .toLowerCase()
          .includes("лакмус_пачка")
      ) {
        switchImage(target, "Лакмус_шт");
        return;
      }
      if (selectedRef.current) {
        removeClassName(target, styles.highlight);
        selectedRef.current = null;
      } else {
        addClassName(target, styles.highlight);
        let found = [
          ...(document.getElementsByClassName(
            styles.molecule
          ) as HTMLCollectionOf<HTMLDivElement>),
        ].find((val) => val !== target);
        // @ts-ignore
        addClassName(found, styles.highlightBlue);
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
        // @ts-ignore
        removeClassName(centralObjectRef.current, styles.highlight);
        switchImage(selectedRef.current, selectedMolecule as string);
      }

      selectedRef.current = event.currentTarget;
      switchImage(selectedRef.current, molecule);
      addClassName(selectedRef.current, styles.highlight);
      // @ts-ignore
      addClassName(centralObjectRef.current, styles.highlight);
      setSelectedMolecule(molecule);
    }
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

  const isConsumed = (molecule: string) => consumedMolecules.includes(molecule);

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
            className={[
              styles.molecule,
              done && correctCombination.includes(molecule) && styles.done,
            ]
              .filter(Boolean)
              .join(" ")}
            aria-disabled={isConsumed(molecule) || isBlocked}
            onClick={(event) => select(event, molecule)}
            style={
              // TODO заменить background на Image
              colors.has(molecule)
                ? { backgroundColor: colors.get(molecule) }
                : {
                    backgroundImage: `url("/assets/images/${encodeURIComponent(
                      molecule.toLowerCase().includes("лакмус")
                        ? "Лакмус_пачка"
                        : molecule
                    )}.png")`,
                  }
            }
          >
            {/* {molecule.split("_")[0]} */}
          </div>
        );
      })}
      {lakmus ? null : (
        <div
          element="центр"
          className={styles.flask}
          ref={centralObjectRef}
          onClick={flaskClick}
          aria-disabled={isBlocked}
        ></div>
      )}
    </div>
  );
}
