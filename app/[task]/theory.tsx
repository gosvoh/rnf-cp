import { useEffect, useRef, useState } from "react";
import styles from "./theory.module.scss";

export default function Theory({
  video,
  next,
}: {
  video: string;
  next: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [done, setDone] = useState(false);

  function reset(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setDone(false);
    setPaused(false);
  }

  function play(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    if (!videoRef.current) return;
    videoRef.current.play();
    setPaused(false);
  }

  function pause(event: React.MouseEvent<any, MouseEvent>) {
    event.preventDefault();
    if (!videoRef.current || videoRef.current.paused) return;
    videoRef.current.pause();
    setPaused(true);
  }

  return (
    <div className={styles.video}>
      <video
        onClick={pause}
        className={paused ? styles.paused : ""}
        ref={videoRef}
        onEnded={() => {
          setDone(true);
          setPaused(true);
        }}
      >
        <source src={`/assets/video/${video}.mp4`} type="video/mp4" />
        Устройство не поддерживает это видео
      </video>

      <div
        className={styles.buttons}
        style={paused ? {} : { zIndex: "-1" }}
        onClick={paused ? undefined : pause}
      >
        <button
          hidden={!done || !paused}
          className={styles.button}
          onClick={reset}
        >
          ↺
        </button>
        <button
          hidden={!paused || done}
          className={styles.button}
          onClick={(ev) => play(ev)}
        >
          ▶
        </button>
        <button
          hidden={!done || !paused}
          className={styles.button}
          onClick={next}
        >
          →
        </button>
      </div>
    </div>
  );
}
