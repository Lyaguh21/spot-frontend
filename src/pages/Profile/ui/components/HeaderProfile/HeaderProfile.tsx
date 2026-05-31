import { useLogoutMutation } from "@/entities/auth";
import {
  SpotActionIcon,
  SpotButton,
  SpotConfirmActionModal,
} from "@/shared/ui";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Group,
  Spoiler,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import styles from "./HeaderProfile.module.css";
import { IconEdit, IconLock, IconLogout } from "@tabler/icons-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import CoupleCard from "../CoupleCard/CoupleCard";
import { IUserState, userLogout } from "@/entities/user";
import { useDisclosure } from "@mantine/hooks";
import EditProfileDrawer from "../EditProfileDrawer/EditProfileDrawer";
import { useAppDispatch } from "@/shared/lib";

export default function HeaderProfile({
  userData,
  isOwnProfile,
}: {
  userData?: IUserState;
  isOwnProfile: boolean;
}) {
  const dispatch = useAppDispatch();
  const statistics = [
    { label: "Мест", value: 10 },
    { label: "Подписчики", value: 100 },
    { label: "Подписки", value: 50 },
  ];

  const [
    openedModalConfirm,
    { open: openModalConfirm, close: closeModalConfirm },
  ] = useDisclosure(false);

  const [
    openedDrawerEditProfile,
    { open: openDrawerEditProfile, close: closeDrawerEditProfile },
  ] = useDisclosure(false);

  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleEditProfile = () => {
    openDrawerEditProfile();
  };
  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    dispatch(userLogout());
  };
  const handleCoupleClick = () => {};
  const handleSubscribeClick = () => {};

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

      <Box className={styles.header}>
        <Flex
          className={styles.usernameRow}
          justify={isOwnProfile ? "space-between" : "center"}
          align="center"
          w={isOwnProfile ? "100%" : "fit-content"}
          mx={isOwnProfile ? undefined : "auto"}
        >
          {isOwnProfile && (
            <SpotActionIcon size={40} onClick={openModalConfirm}>
              <IconLogout
                color={theme.colors.red[6]}
                style={{ marginLeft: 4 }}
              />
            </SpotActionIcon>
          )}

          <Text fz="lg">@{userData?.username}</Text>

          {isOwnProfile && (
            <SpotActionIcon size={40} onClick={handleEditProfile}>
              <IconEdit />
            </SpotActionIcon>
          )}
        </Flex>

        <Flex gap="lg" align="center" mt="lg">
          <Box className={styles.avatarFrame}>
            <Avatar
              size="100"
              src={userData?.avatarUrl}
              className={styles.avatar}
            >
              {userData?.username.charAt(0)}
            </Avatar>
          </Box>

          <Stack gap={0}>
            <Group gap={4} align="center">
              <Text fz="32px" c="white" lh={1}>
                {userData?.name}
              </Text>
              {userData?.visibility === "PRIVATE" && <IconLock />}
            </Group>
            <Spoiler
              maxHeight={68}
              showLabel="Показать"
              hideLabel="Скрыть"
              classNames={{
                root: styles.spoiler,
                control: styles.spoilerControl,
              }}
            >
              <Text c="dimmed" className={styles.bio}>
                {userData?.bio}
              </Text>
            </Spoiler>
          </Stack>
        </Flex>
        <Group justify="center" mt="lg" gap="24">
          {statistics.map((stat, index) => (
            <Fragment key={stat.label}>
              <Box>
                <Text fz="24px" c="primary" fw={700} ta="center">
                  {stat.value}
                </Text>
                <Text c="dimmed">{stat.label}</Text>
              </Box>
              {index < statistics.length - 1 ? (
                <Divider orientation="vertical" />
              ) : null}
            </Fragment>
          ))}
        </Group>

        <CoupleCard
          userData={userData}
          isOwnProfile={isOwnProfile}
          handleCoupleClick={handleCoupleClick}
        />

        {!isOwnProfile && (
          <SpotButton
            fullWidth
            mt="lg"
            size="lg"
            radius="lg"
            onClick={handleSubscribeClick}
          >
            Подписаться
          </SpotButton>
        )}
      </Box>
    </>
  );
}
