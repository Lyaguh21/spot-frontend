import { useLogoutMutation } from "@/entities/auth";
import { userLogout } from "@/entities/user";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { SpotConfirmActionModal, SpotDrawer, SpotGlassCard } from "@/shared/ui";
import { Stack, Text, UnstyledButton, Group, ThemeIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSchool,
  IconBug,
  IconLogout,
  IconChevronRight,
  IconCode,
  IconUserCode,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsDrawer.module.css";
import { selectUser } from "@/entities/user";

type SettingsOption = {
  title: string;
  description: string;
  icon: React.ReactNode;
  danger?: boolean;
  adminOnly?: boolean;
  onClick: () => void;
};

export default function SettingsDrawer({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [
    openedModalConfirm,
    { open: openModalConfirm, close: closeModalConfirm },
  ] = useDisclosure(false);

  const openOnboarding = () => {
    localStorage.removeItem("onboardingCompleted");
    onClose();
    navigate("/onboarding");
  };

  const settingsOptions: SettingsOption[] = [
    {
      title: "Пройти обучение заново",
      description: "Краткий гид по возможностям приложения",
      icon: <IconSchool size={24} stroke={1.8} />,
      onClick: openOnboarding,
    },
    {
      title: "Пожаловаться на баг",
      description: "Расскажите нам, что пошло не так",
      icon: <IconBug size={24} stroke={1.8} />,
      onClick: () => {}, //todo реализовать
    },
    {
      title: "О проекте",
      description: "Информация о проекте и его разработчиках",
      icon: <IconCode size={24} stroke={1.8} />,
      onClick: () => {}, //todo реализовать
    },
    {
      title: "Админка",
      description: "Панель администратора",
      icon: <IconUserCode size={24} stroke={1.8} />,
      adminOnly: true,
      onClick: () => {}, //todo реализовать
    },
    {
      title: "Выйти из аккаунта",
      description: "Вы выйдете из аккаунта на этом устройстве",
      icon: <IconLogout size={24} stroke={1.8} />,
      danger: true,
      onClick: openModalConfirm,
    },
  ];

  const handleLogout = async () => {
    await logout();
    dispatch(userLogout());
    navigate("/auth/login");
  };

  return (
    <>
      <SpotConfirmActionModal
        opened={openedModalConfirm}
        onClose={closeModalConfirm}
        question="Вы уверены, что хотите выйти?"
        confirmText="Выйти"
        confirmLoading={isLoggingOut}
        onConfirm={handleLogout}
      />

      <SpotDrawer title="Настройки" opened={opened} onClose={onClose}>
        <Stack className={styles.options} gap="sm">
          {settingsOptions
            .filter((option) => !option.adminOnly || user.role === "ADMIN")
            .map((option) => (
              <SpotGlassCard
                component={UnstyledButton}
                className={`${styles.option} ${
                  option.danger ? styles.danger : ""
                }`}
                isButton
                key={option.title}
                onClick={option.onClick}
              >
                <Group gap="md" wrap="nowrap">
                  <ThemeIcon
                    className={styles.icon}
                    data-danger={option.danger || undefined}
                    size={52}
                    radius="xl"
                    variant="transparent"
                  >
                    {option.icon}
                  </ThemeIcon>

                  <Stack className={styles.copy} gap={2}>
                    <Text className={styles.optionTitle}>{option.title}</Text>
                    <Text className={styles.description}>
                      {option.description}
                    </Text>
                  </Stack>

                  <IconChevronRight
                    className={styles.chevron}
                    size={20}
                    stroke={1.8}
                  />
                </Group>
              </SpotGlassCard>
            ))}
        </Stack>
      </SpotDrawer>
    </>
  );
}
