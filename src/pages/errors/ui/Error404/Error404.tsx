import { Text } from "@mantine/core";
import { Link } from "react-router-dom";
import SpotButton from "@/shared/ui/SpotButton/SpotButton";
import styles from "./Error404.module.css";

export default function Error404() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <Text className={styles.title}>Страница не найдена</Text>
        <Text className={styles.description}>
          Такой страницы нет или ссылка устарела. Проверьте адрес или вернитесь
          к ленте.
        </Text>
        <div className={styles.actions}>
          <SpotButton component={Link} to="/" size="lg" radius="lg">
            На главную
          </SpotButton>
        </div>
      </div>
    </div>
  );
}
