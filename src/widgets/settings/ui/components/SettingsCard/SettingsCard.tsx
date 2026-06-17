import { SpotGlassCard } from "@/shared/ui";
import { UnstyledButton, Group, ThemeIcon, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import styles from "./SettingsCard.module.css";
import { SettingsOption } from "@/widgets/settings/model/type";
export default function SettingsCard({ option }: { option: SettingsOption }) {
  return (
    <SpotGlassCard
      component={UnstyledButton}
      className={`${styles.option} ${option.danger ? styles.danger : ""}`}
      isButton
      key={option.title}
      onClick={option.onClick}
    >
      <Group gap="md" wrap="nowrap">
        <ThemeIcon
          className={styles.icon}
          data-danger={option.danger || undefined}
          size={48}
          radius="xl"
          variant="transparent"
        >
          {option.icon}
        </ThemeIcon>

        <Stack className={styles.copy} gap={2}>
          <Text className={styles.optionTitle}>{option.title}</Text>
          <Text className={styles.description}>{option.description}</Text>
        </Stack>

        <IconChevronRight className={styles.chevron} size={20} stroke={1.8} />
      </Group>
    </SpotGlassCard>
  );
}
