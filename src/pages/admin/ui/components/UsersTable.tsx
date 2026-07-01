import type { IUserStatisticsResponse } from "@/entities/admin";
import { SpotActionIcon } from "@/shared/ui";
import { Group, ScrollArea, Skeleton, Table } from "@mantine/core";
import { formatDate } from "../../lib/formatters";
import styles from "../Admin.module.css";
import EmptyState from "./EmptyState";
import UserIdentity from "./UserIdentity";
import {
  IconBan,
  IconBandage,
  IconExternalLinkFilled,
  IconTrash,
  IconTrashOff,
} from "@tabler/icons-react";

export default function UsersTable({
  users,
  isLoading,
  isError,
  onNavigateUser,
  handleDeleteUser,
  handleBanUser,
}: {
  users: IUserStatisticsResponse[];
  isLoading: boolean;
  isError: boolean;
  onNavigateUser: (username?: string) => void;
  handleDeleteUser: (user?: IUserStatisticsResponse) => void;
  handleBanUser: (user?: IUserStatisticsResponse) => void;
}) {
  if (isLoading) {
    return (
      <Skeleton className={styles.tableSkeleton} height={220} radius="lg" />
    );
  }

  if (isError) {
    return <EmptyState>Не удалось загрузить пользователей</EmptyState>;
  }

  if (!users.length) {
    return <EmptyState>Пользователей пока нет</EmptyState>;
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
            <Table.Th>Пользователь</Table.Th>
            <Table.Th>Создан</Table.Th>
            <Table.Th>Места</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>
                <UserIdentity user={user} />
              </Table.Td>
              <Table.Td>{formatDate(user.createdAt)}</Table.Td>
              <Table.Td>{user.places}</Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <SpotActionIcon
                    size="lg"
                    onClick={() => onNavigateUser(user.username)}
                  >
                    <IconExternalLinkFilled />
                  </SpotActionIcon>
                  <SpotActionIcon
                    size="lg"
                    color={!user.isDeleted ? "red" : "green"}
                    onClick={() => handleDeleteUser(user)}
                  >
                    {!user.isDeleted ? <IconTrash /> : <IconTrashOff />}
                  </SpotActionIcon>
                  <SpotActionIcon
                    size="lg"
                    color={!user.isBanned ? "red" : "green"}
                    onClick={() => handleBanUser(user)}
                  >
                    {!user.isBanned ? <IconBan /> : <IconBandage />}
                  </SpotActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
