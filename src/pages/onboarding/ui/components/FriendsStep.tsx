import styles from "./StepVisual.module.css";

export default function FriendsStep() {
  return (
    <div className={styles.visual}>
      <img
        className={`${styles.image} ${styles.phone}`}
        src="/img/IphoneWithFriends.png"
        alt="Карта мест друзей"
      />
    </div>
  );
}
