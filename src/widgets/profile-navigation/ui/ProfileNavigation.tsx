import { SpotActionIcon } from "@/shared/ui";
import { Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconArrowLeft, IconSettings } from "@tabler/icons-react";
import EditProfileDrawer from "../../../pages/profile/ui/components/EditProfileDrawer/EditProfileDrawer";
import { useNavigate } from "react-router-dom";
import { IUserState } from "@/entities/user";

import styles from "./ProfileNavigation.module.css";
import { SettingsDrawer } from "@/widgets/settings";
export default function ProfileNavigation({
  isOwnProfile,
  userData,
}: {
  isOwnProfile: boolean;
  userData?: IUserState;
}) {
  const navigate = useNavigate();

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

        <Text fz="lg">@{userData?.username}</Text>

        {isOwnProfile && (
          <SpotActionIcon size={40} onClick={handleEditProfile}>
            <IconEdit />
          </SpotActionIcon>
        )}
      </Flex>
    </>
  );
}
