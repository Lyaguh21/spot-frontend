import { Text } from "@mantine/core";
import styles from "./Banned.module.css";
import { SpotButton } from "@/shared/ui";
import { Link } from "react-router-dom";
import { IconMoodSadDizzy } from "@tabler/icons-react";

export default function Banned() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <IconMoodSadDizzy size="64" />
        <Text className={styles.title}>Вы были заблокированы</Text>
        <Text className={styles.description}>
          Ой... похоже ваш аккаунт был заблокирован. Если вы считаете, что это
          ошибка, пожалуйста, свяжитесь с нашей поддержкой.
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
