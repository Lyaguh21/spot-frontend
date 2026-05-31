import { Text } from "@mantine/core";
import styles from "./ClosedProfile.module.css";
import { SpotButton } from "@/shared/ui";
import { Link } from "react-router-dom";

export default function ClosedProfile() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Text className={styles.title}>Этот профиль приватный</Text>
        <Text className={styles.description}>
          Упс... у вас нет доступа к этому профилю. Вероятно, он закрыт
          владельцем.
        </Text>
        <SpotButton
          component={Link}
          to="/"
          fullWidth
          size="lg"
          radius="lg"
          mt="md"
        >
          На главную
        </SpotButton>
      </div>
    </div>
  );
}
