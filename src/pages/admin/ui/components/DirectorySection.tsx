import type {
  ICouplesStatisticsResponse,
  IUserStatisticsResponse,
} from "@/entities/admin";
import { SpotFloatingIndicator } from "@/shared/ui";
import { Box, Group, Text } from "@mantine/core";
import { useState } from "react";
import type { DirectoryView } from "../../model/types";
import styles from "../Admin.module.css";
import CouplesTable from "./CouplesTable";
import UsersTable from "./UsersTable";

const directoryItems = [
  { value: "users", label: "Пользователи" },
  { value: "couples", label: "Пары" },
];

export default function DirectorySection({
  users,
  usersIsLoading,
  usersIsError,
  couples,
  couplesIsLoading,
  couplesIsError,
  onNavigateUser,
  onNavigateCouple,
}: {
  users: IUserStatisticsResponse[];
  usersIsLoading: boolean;
  usersIsError: boolean;
  couples: ICouplesStatisticsResponse[];
  couplesIsLoading: boolean;
  couplesIsError: boolean;
  onNavigateUser: (username?: string) => void;
  onNavigateCouple: (id?: string) => void;
}) {
  const [directoryView, setDirectoryView] = useState<DirectoryView>("users");

  return (
    <section className={styles.section}>
      <Group justify="space-between" align="center" mb={12}>
        <Text className={styles.sectionTitle}>Справочник</Text>
      </Group>

      <SpotFloatingIndicator
        items={directoryItems}
        value={directoryView}
        setValue={(value) => setDirectoryView(value as DirectoryView)}
        size="sm"
      />

      <Box mt={12}>
        {directoryView === "users" ? (
          <UsersTable
            users={users}
            isLoading={usersIsLoading}
            isError={usersIsError}
            onNavigateUser={onNavigateUser}
          />
        ) : (
          <CouplesTable
            couples={couples}
            isLoading={couplesIsLoading}
            isError={couplesIsError}
            onNavigateUser={onNavigateUser}
            onNavigateCouple={onNavigateCouple}
          />
        )}
      </Box>
    </section>
  );
}
