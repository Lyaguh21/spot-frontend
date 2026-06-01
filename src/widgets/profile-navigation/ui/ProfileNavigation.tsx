import { useAppDispatch } from "@/shared/lib";
import { SpotActionIcon, SpotConfirmActionModal } from "@/shared/ui";
import { Flex, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconEdit, IconArrowLeft } from "@tabler/icons-react";
import EditProfileDrawer from "../../../pages/profile/ui/components/EditProfileDrawer/EditProfileDrawer";
import { useLogoutMutation } from "@/entities/auth";
import { useNavigate } from "react-router-dom";
import { IUserState, userLogout } from "@/entities/user";

import styles from "./ProfileNavigation.module.css";
export default function ProfileNavigation({
  isOwnProfile,
  userData,
}: {
  isOwnProfile: boolean;
  userData?: IUserState;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const theme = useMantineTheme();

  const [
    openedDrawerEditProfile,
    { open: openDrawerEditProfile, close: closeDrawerEditProfile },
  ] = useDisclosure(false);
  const [
    openedModalConfirm,
    { open: openModalConfirm, close: closeModalConfirm },
  ] = useDisclosure(false);

  const handleEditProfile = () => {
    openDrawerEditProfile();
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    dispatch(userLogout());
  };

  return (
    <>
      <SpotConfirmActionModal
        opened={openedModalConfirm}
        onClose={closeModalConfirm}
        question="Вы уверены, что хотите выйти?"
        confirmText="Выйти"
        onConfirm={handleLogout}
      />
      <EditProfileDrawer
        opened={openedDrawerEditProfile}
        onClose={closeDrawerEditProfile}
      />

      {!isOwnProfile && (
        <SpotActionIcon
          size={47}
          onClick={() => navigate(-1)}
          style={{ position: "absolute", left: 32, top: 24 }}
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
          <SpotActionIcon size={40} onClick={openModalConfirm}>
            <IconLogout color={theme.colors.red[6]} style={{ marginLeft: 4 }} />
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
