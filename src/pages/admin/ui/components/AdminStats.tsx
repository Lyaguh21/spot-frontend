import type { IStatisticsResponse } from "@/entities/admin";
import { SpotGlassCard } from "@/shared/ui";
import { Group, SimpleGrid, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconBug, IconHeart, IconMapPin, IconUser } from "@tabler/icons-react";
import { useMemo } from "react";
import styles from "../Admin.module.css";

export default function AdminStats({
  statistics,
  bugReportsCount,
  isLoading,
  isError,
}: {
  statistics?: IStatisticsResponse;
  bugReportsCount: number;
  isLoading: boolean;
  isError: boolean;
}) {
  const stats = useMemo(
    () => [
      { label: "Пользователи", value: statistics?.users, icon: IconUser },
      { label: "Пары", value: statistics?.couples, icon: IconHeart },
      { label: "Места", value: statistics?.places, icon: IconMapPin },
      { label: "Обращения", value: bugReportsCount, icon: IconBug },
    ],
    [bugReportsCount, statistics?.couples, statistics?.places, statistics?.users],
  );

  return (
    <SimpleGrid cols={2} spacing={12}>
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <SpotGlassCard className={styles.statCard} key={stat.label}>
            <Group gap={10} wrap="nowrap" align="center">
              <ThemeIcon className={styles.statIcon} size={42} radius="xl">
                <Icon size={21} />
              </ThemeIcon>
              <Stack gap={1} className={styles.statCopy}>
                <Text className={styles.statValue}>
                  {isLoading ? (
                    <Skeleton width={42} height={22} radius="sm" />
                  ) : isError && stat.label !== "Обращения" ? (
                    "?"
                  ) : (
                    (stat.value ?? 0)
                  )}
                </Text>
                <Text className={styles.statLabel}>{stat.label}</Text>
              </Stack>
            </Group>
          </SpotGlassCard>
        );
      })}
    </SimpleGrid>
  );
}
