import styles from "./StepVisual.module.css";

export default function PlacesStep() {
  return (
    <div className={styles.visual}>
      <img
        className={`${styles.image} ${styles.phone}`}
        src="/img/IphoneWithMarkers.png"
        alt="Карта с сохраненными местами"
      />
    </div>
  );
}
