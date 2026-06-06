import styles from "./StepVisual.module.css";

export default function WelcomeStep() {
  return (
    <div className={styles.visual}>
      <img className={styles.logo} src="/icons/FullLogo.svg" alt="SPOT" />
      <img
        className={`${styles.image} ${styles.globe}`}
        src="/img/Globus.png"
        alt="Карта важных мест"
      />
    </div>
  );
}
