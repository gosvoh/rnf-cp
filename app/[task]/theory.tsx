import styles from "./theory.module.scss";

export default function Theory({
  video,
  next,
}: {
  video: string;
  next: () => void;
}) {
  return (
    <video
      className={styles.video}
      onError={next}
      onEnded={next}
      autoPlay={true}
    >
      <source src={`/assets/video/${video}.mp4`} type="video/mp4" />
      Устройство не поддерживает это видео
    </video>
  );
}
