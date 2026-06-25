import { SpotActionIcon, SpotSkeletonLoader } from "@/shared/ui";
import { Flex, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEdit,
  IconArrowLeft,
  IconSettings,
  IconCopy,
} from "@tabler/icons-react";
import EditProfileDrawer from "../../../pages/profile/ui/components/EditProfileDrawer/EditProfileDrawer";
import { useNavigate } from "react-router-dom";
import { IUserState } from "@/entities/user";

import styles from "./ProfileNavigation.module.css";
import { SettingsDrawer } from "@/widgets/settings";
import { useNotifications } from "@/shared/lib";

export default function ProfileNavigation({
  isOwnProfile,
  userData,
}: {
  isOwnProfile: boolean;
  userData?: IUserState;
}) {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotifications();

  const [
    openedDrawerEditProfile,
    { open: openDrawerEditProfile, close: closeDrawerEditProfile },
  ] = useDisclosure(false);

  const [
    openedDrawerSettings,
    { open: openDrawerSettings, close: closeDrawerSettings },
  ] = useDisclosure(false);

  const handleEditProfile = () => {
    openDrawerEditProfile();
  };

  const handleOpenSettings = () => {
    openDrawerSettings();
  };

  const handleCopyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess("Ссылка скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  };

  return (
    <>
      <SettingsDrawer
        opened={openedDrawerSettings}
        onClose={closeDrawerSettings}
      />

      <EditProfileDrawer
        opened={openedDrawerEditProfile}
        onClose={closeDrawerEditProfile}
      />

      {!isOwnProfile && (
        <SpotActionIcon
          size={47}
          onClick={() => navigate(-1)}
          style={{ position: "absolute", left: 32, top: 16 }}
        >
          <IconArrowLeft />
        </SpotActionIcon>
      )}

      <Flex
        className={styles.usernameRow}
        justify={isOwnProfile ? "space-between" : "center"}
        align="center"
        w={isOwnProfile ? "100%" : "fit-content"}
        mx={isOwnProfile ? undefined : "auto"}
      >
        {isOwnProfile && (
          <SpotActionIcon size={40} onClick={handleOpenSettings}>
            <IconSettings />
          </SpotActionIcon>
        )}
        {userData ? (
          <Menu shadow="lg" width={220} position="bottom" withinPortal>
            <Menu.Target>
              <Text component="span" fz="lg">
                @{userData.username}
              </Text>
            </Menu.Target>
            <Menu.Dropdown className={styles.menuDropdown}>
              <Menu.Item
                leftSection={<IconCopy size={17} />}
                onClick={handleCopyCurrentUrl}
              >
                Скопировать ссылку
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <SpotSkeletonLoader w={75} h={28} radius={999} />
        )}

        {isOwnProfile && (
          <SpotActionIcon size={40} onClick={handleEditProfile}>
            <IconEdit />
          </SpotActionIcon>
        )}
      </Flex>
    </>
  );
}
