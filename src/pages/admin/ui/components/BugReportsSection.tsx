import type { IListBugReportResponse } from "@/entities/admin";
import { SpotActionIcon } from "@/shared/ui";
import { Badge, Group, ScrollArea, Skeleton, Table, Text } from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { formatDate, getBugReportTypeLabel } from "../../lib/formatters";
import styles from "../Admin.module.css";
import EmptyState from "./EmptyState";
import UserIdentity from "./UserIdentity";

export default function BugReportsSection({
  bugReports,
  isLoading,
  isError,
  onOpen,
  onDelete,
  onNavigateUser,
}: {
  bugReports: IListBugReportResponse[];
  isLoading: boolean;
  isError: boolean;
  onOpen: (report: IListBugReportResponse) => void;
  onDelete: (report: IListBugReportResponse) => void;
  onNavigateUser: (username?: string) => void;
}) {
  return (
    <section className={styles.section}>
      <Group justify="space-between" align="center" mb={12}>
        <Text className={styles.sectionTitle}>Обращения пользователей</Text>
        <Badge className={styles.countBadge}>{bugReports.length}</Badge>
      </Group>

      {isLoading ? (
        <Skeleton className={styles.tableSkeleton} height={220} radius="lg" />
      ) : isError ? (
        <EmptyState>Не удалось загрузить обращения</EmptyState>
      ) : !bugReports.length ? (
        <EmptyState>Обращений пока нет</EmptyState>
      ) : (
        <ScrollArea className={styles.tableScroll} type="auto">
          <Table
            className={styles.table}
            verticalSpacing="sm"
            horizontalSpacing="md"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Кто обратился</Table.Th>
                <Table.Th>Название</Table.Th>
                <Table.Th>Тип</Table.Th>
                <Table.Th>Создано</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {bugReports.map((report) => (
                <Table.Tr key={report.id}>
                  <Table.Td>
                    <UserIdentity
                      user={report.user}
                      onClick={() => onNavigateUser(report.user?.username)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Text className={styles.reportTitle}>{report.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge className={styles.typeBadge}>
                      {getBugReportTypeLabel(report.type)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{formatDate(report.createdAt)}</Table.Td>
                  <Table.Td>
                    <Group gap={8} wrap="nowrap" justify="flex-end">
                      <SpotActionIcon
                        size={36}
                        aria-label="Открыть обращение"
                        onClick={() => onOpen(report)}
                      >
                        <IconEye size={18} />
                      </SpotActionIcon>
                      <SpotActionIcon
                        size={36}
                        className={styles.deleteAction}
                        aria-label="Удалить обращение"
                        onClick={() => onDelete(report)}
                      >
                        <IconTrash size={18} />
                      </SpotActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </section>
  );
}
