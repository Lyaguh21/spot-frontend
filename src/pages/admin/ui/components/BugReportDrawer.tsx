import type { IListBugReportResponse } from "@/entities/admin";
import { SpotButton, SpotDrawer, SpotGlassCard } from "@/shared/ui";
import { Badge, Group, Image, Stack, Text } from "@mantine/core";
import { formatDate, getBugReportTypeLabel } from "../../lib/formatters";
import styles from "../Admin.module.css";
import EmptyState from "./EmptyState";
import UserIdentity from "./UserIdentity";

export default function BugReportDrawer({
  report,
  onClose,
  onDelete,
  onNavigateUser,
}: {
  report: IListBugReportResponse | null;
  onClose: () => void;
  onDelete: (report: IListBugReportResponse) => void;
  onNavigateUser: (username?: string) => void;
}) {
  return (
    <SpotDrawer
      opened={Boolean(report)}
      onClose={onClose}
      title="Обращение"
      size="82%"
    >
      {report && (
        <Stack gap={16} className={styles.drawerContent}>
          <Group justify="space-between" gap={12} align="flex-start">
            <Stack gap={4} className={styles.drawerTitleBlock}>
              <Text className={styles.drawerTitle}>{report.title}</Text>
              <Text className={styles.drawerMeta}>{formatDate(report.createdAt)}</Text>
            </Stack>
            <Badge className={styles.typeBadge}>
              {getBugReportTypeLabel(report.type)}
            </Badge>
          </Group>

          <SpotGlassCard className={styles.drawerCard}>
            <Stack gap={10}>
              <Text className={styles.drawerLabel}>Кто обратился</Text>
              <UserIdentity
                user={report.user}
                onClick={() => onNavigateUser(report.user?.username)}
              />
            </Stack>
          </SpotGlassCard>

          <SpotGlassCard className={styles.drawerCard}>
            <Stack gap={8}>
              <Text className={styles.drawerLabel}>Описание</Text>
              <Text className={styles.description}>
                {report.description || "Описание не указано"}
              </Text>
            </Stack>
          </SpotGlassCard>

          {report.photoUrl ? (
            <Stack gap={8}>
              <Text className={styles.drawerLabel}>Фото</Text>
              <Image
                className={styles.reportImage}
                src={report.photoUrl}
                alt={report.title}
                radius="lg"
                fit="cover"
              />
            </Stack>
          ) : (
            <EmptyState>Фото не приложено</EmptyState>
          )}

          <SpotButton className={styles.drawerDelete} onClick={() => onDelete(report)}>
            Удалить обращение
          </SpotButton>
        </Stack>
      )}
    </SpotDrawer>
  );
}
