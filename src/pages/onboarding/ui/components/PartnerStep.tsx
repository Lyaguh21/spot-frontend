import styles from "./StepVisual.module.css";

export default function PartnerStep() {
  return (
    <div className={styles.visual}>
      <img
        className={`${styles.image} ${styles.phone}`}
        src="/img/Partner.png"
        alt="Общая карта пары"
      />
    </div>
  );
}
