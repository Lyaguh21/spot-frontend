import type { ICouplesStatisticsResponse } from "@/entities/admin";
import { SpotButton } from "@/shared/ui";
import { ScrollArea, Skeleton, Table } from "@mantine/core";
import { formatDate } from "../../lib/formatters";
import styles from "../Admin.module.css";
import EmptyState from "./EmptyState";
import UserIdentity from "./UserIdentity";

export default function CouplesTable({
  couples,
  isLoading,
  isError,
  onNavigateCouple,
  onNavigateUser,
}: {
  couples: ICouplesStatisticsResponse[];
  isLoading: boolean;
  isError: boolean;
  onNavigateCouple: (id?: string) => void;
  onNavigateUser: (username?: string) => void;
}) {
  if (isLoading) {
    return (
      <Skeleton className={styles.tableSkeleton} height={220} radius="lg" />
    );
  }

  if (isError) {
    return <EmptyState>Не удалось загрузить пары</EmptyState>;
  }

  if (!couples.length) {
    return <EmptyState>Пар пока нет</EmptyState>;
  }

  return (
    <ScrollArea className={styles.tableScroll} type="auto">
      <Table
        className={styles.table}
        verticalSpacing="sm"
        horizontalSpacing="md"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Участник 1</Table.Th>
            <Table.Th>Участник 2</Table.Th>
            <Table.Th>Создано</Table.Th>
            <Table.Th>Места</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {couples.map((couple) => {
            const [firstMember, secondMember] = couple.members;

            return (
              <Table.Tr key={couple.id}>
                <Table.Td>
                  <UserIdentity
                    user={firstMember}
                    onClick={() => onNavigateUser(firstMember?.username)}
                  />
                </Table.Td>
                <Table.Td>
                  <UserIdentity
                    user={secondMember}
                    onClick={() => onNavigateUser(secondMember?.username)}
                  />
                </Table.Td>
                <Table.Td>{formatDate(couple.createdAt)}</Table.Td>
                <Table.Td>{couple.places}</Table.Td>
                <Table.Td>
                  <SpotButton
                    kind="glass"
                    size="xs"
                    onClick={() => onNavigateCouple(couple.id)}
                  >
                    Профиль
                  </SpotButton>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
