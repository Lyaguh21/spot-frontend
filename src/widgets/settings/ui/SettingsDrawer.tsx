import { useLogoutMutation } from "@/entities/auth";
import { userLogout } from "@/entities/user";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { resetAllOnboardings } from "@/shared/utils";
import {
  SpotActionIcon,
  SpotConfirmActionModal,
  SpotDrawer,
} from "@/shared/ui";
import { Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSchool,
  IconBug,
  IconLogout,
  IconCode,
  IconUserCode,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { selectUser } from "@/entities/user";
import { useState } from "react";
import { SettingsOption } from "../model/type";
import SettingsCard from "./components/SettingsCard/SettingsCard";
import BugReportPage from "./components/BugReportPage/BugReportPage";
import AboutPage from "./components/AboutPage/AboutPage";

const DRAWER_TITLE = {
  settings: "Настройки",
  "bug-report": "Обратная связь",
  about: "О проекте",
};

export default function SettingsDrawer({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState<
    "settings" | "bug-report" | "about"
  >("settings");
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [
    openedModalConfirm,
    { open: openModalConfirm, close: closeModalConfirm },
  ] = useDisclosure(false);

  const openOnboarding = () => {
    resetAllOnboardings();
    onClose();
    navigate("/onboarding");
  };

  const settingsOptions: SettingsOption[] = [
    {
      title: "Сбросить обучение",
      description: "Вводный экран и гид по функциям запустятся заново",
      icon: <IconSchool size={24} stroke={1.8} />,
      onClick: openOnboarding,
    },
    {
      title: "Обратная связь",
      description: "Пожаловаться на баг или предложить идею",
      icon: <IconBug size={24} stroke={1.8} />,
      onClick: () => {
        setSelectedOption("bug-report");
      },
    },
    {
      title: "О проекте",
      description: "Информация о проекте и его разработчиках",
      icon: <IconCode size={24} stroke={1.8} />,
      onClick: () => {
        setSelectedOption("about");
      },
    },
    {
      title: "Админка",
      description: "Панель администратора",
      icon: <IconUserCode size={24} stroke={1.8} />,
      adminOnly: true,
      onClick: () => {
        navigate("/admin");
      },
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

      <SpotDrawer
        title={DRAWER_TITLE[selectedOption]}
        opened={opened}
        onClose={() => {
          onClose();
          setSelectedOption("settings");
        }}
      >
        {selectedOption !== "settings" && (
          <SpotActionIcon onClick={() => setSelectedOption("settings")}>
            <IconArrowLeft />
          </SpotActionIcon>
        )}
        {selectedOption === "settings" && (
          <Stack w="100%" pt={4} pb={2} gap="sm">
            {settingsOptions
              .filter((option) => !option.adminOnly || user.role === "ADMIN")
              .map((option, index) => (
                <SettingsCard key={index} option={option} />
              ))}
          </Stack>
        )}

        {selectedOption === "bug-report" && (
          <BugReportPage
            onClose={onClose}
            setSelectedOption={setSelectedOption}
          />
        )}
        {selectedOption === "about" && <AboutPage />}
      </SpotDrawer>
    </>
  );
}
