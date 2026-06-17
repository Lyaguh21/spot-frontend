import {
  useDeleteBugReportMutation,
  useGetAdminStatisticsQuery,
  useGetBugReportsQuery,
  useGetCouplesStatisticsQuery,
  useGetUsersStatisticsQuery,
} from "@/entities/admin";
import type { IListBugReportResponse } from "@/entities/admin";
import { useNotifications } from "@/shared/lib";
import { SpotActionIcon, SpotConfirmActionModal } from "@/shared/ui";
import { Group, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import AdminStats from "./components/AdminStats";
import BugReportDrawer from "./components/BugReportDrawer";
import BugReportsSection from "./components/BugReportsSection";
import DirectorySection from "./components/DirectorySection";
import { IconArrowLeft } from "@tabler/icons-react";

export default function Admin() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotifications();
  const [openedBugReport, setOpenedBugReport] =
    useState<IListBugReportResponse | null>(null);
  const [bugReportToDelete, setBugReportToDelete] =
    useState<IListBugReportResponse | null>(null);

  const {
    data: statistics,
    isLoading: statisticsIsLoading,
    isError: statisticsIsError,
  } = useGetAdminStatisticsQuery();
  const {
    data: users = [],
    isLoading: usersIsLoading,
    isError: usersIsError,
  } = useGetUsersStatisticsQuery();
  const {
    data: couples = [],
    isLoading: couplesIsLoading,
    isError: couplesIsError,
  } = useGetCouplesStatisticsQuery();
  const {
    data: bugReports = [],
    isLoading: bugReportsIsLoading,
    isError: bugReportsIsError,
  } = useGetBugReportsQuery();
  const [deleteBugReport, { isLoading: deleteIsLoading }] =
    useDeleteBugReportMutation();

  const navigateToUser = (username?: string) => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  const navigateToCouple = (id?: string) => {
    if (id) {
      navigate(`/couple/${id}`);
    }
  };

  const handleDeleteBugReport = async () => {
    if (!bugReportToDelete) {
      return;
    }

    try {
      await deleteBugReport(bugReportToDelete.id).unwrap();
      showSuccess("Обращение удалено");
      setBugReportToDelete(null);

      if (openedBugReport?.id === bugReportToDelete.id) {
        setOpenedBugReport(null);
      }
    } catch (error) {
      showError("Не удалось удалить обращение");
    }
  };

  return (
    <main className={styles.page}>
      <Stack gap={18}>
        <header className={styles.header}>
          <Group>
            <SpotActionIcon onClick={() => navigate(-1)}>
              <IconArrowLeft />
            </SpotActionIcon>
            <Stack gap={4}>
              <Text className={styles.kicker}>Админка SPOT</Text>
              <Title className={styles.title} order={1}>
                Панель управления
              </Title>
            </Stack>
          </Group>
        </header>

        <AdminStats
          statistics={statistics}
          bugReportsCount={bugReports.length}
          isLoading={statisticsIsLoading}
          isError={statisticsIsError}
        />

        <DirectorySection
          users={users}
          usersIsLoading={usersIsLoading}
          usersIsError={usersIsError}
          couples={couples}
          couplesIsLoading={couplesIsLoading}
          couplesIsError={couplesIsError}
          onNavigateUser={navigateToUser}
          onNavigateCouple={navigateToCouple}
        />

        <BugReportsSection
          bugReports={bugReports}
          isLoading={bugReportsIsLoading}
          isError={bugReportsIsError}
          onOpen={setOpenedBugReport}
          onDelete={setBugReportToDelete}
          onNavigateUser={navigateToUser}
        />
      </Stack>

      <BugReportDrawer
        report={openedBugReport}
        onClose={() => setOpenedBugReport(null)}
        onDelete={setBugReportToDelete}
        onNavigateUser={navigateToUser}
      />

      <SpotConfirmActionModal
        opened={Boolean(bugReportToDelete)}
        onClose={() => setBugReportToDelete(null)}
        onConfirm={handleDeleteBugReport}
        question="Удалить обращение пользователя? Это действие нельзя отменить."
        confirmText="Удалить"
        confirmLoading={deleteIsLoading}
      />
    </main>
  );
}
