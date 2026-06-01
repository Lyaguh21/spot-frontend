import { SpotButton } from "@/shared/ui";
import { Avatar, Box, Flex, Group, Spoiler, Stack, Text } from "@mantine/core";
import styles from "./HeaderProfile.module.css";
import { IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import CoupleCard from "@/widgets/couple-card";
import { IUserState } from "@/entities/user";
import { useDisclosure } from "@mantine/hooks";
import AddCoupleDrawer from "../AddCoupleDrawer/AddCoupleDrawer";
import ProfileNavigation from "@/widgets/profile-navigation";
import StatisticsProfile from "@/widgets/statistics-profile";

export default function HeaderProfile({
  userData,
  isOwnProfile,
}: {
  userData?: IUserState;
  isOwnProfile: boolean;
}) {
  const statistics = [
    { label: "Мест", value: userData?.stats.places ?? 0 },
    {
      label: "Подписчики",
      value: userData?.stats.followers ?? 0,
      link: `/profile/${userData?.username}/${"followers"}`,
    },
    {
      label: "Подписки",
      value: userData?.stats.following ?? 0,
      link: `/profile/${userData?.username}/${"following"}`,
    },
  ];

  const [
    openedCoupleDrawer,
    { open: openCoupleDrawer, close: closeCoupleDrawer },
  ] = useDisclosure(false);

  const navigate = useNavigate();

  const handleCoupleClick = () => {
    if (userData?.partner) {
      navigate("/couple/");
    } //!
    else {
      openCoupleDrawer();
    }
  };
  const handleSubscribeClick = () => {};

  return (
    <>
      <AddCoupleDrawer
        opened={openedCoupleDrawer}
        onClose={closeCoupleDrawer}
      />

      <Box className={styles.header}>
        <ProfileNavigation isOwnProfile={isOwnProfile} userData={userData} />

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
              maxHeight={45}
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

        <StatisticsProfile statistics={statistics} />

        {!isOwnProfile && (
          <SpotButton
            fullWidth
            mt="lg"
            size="md"
            radius="lg"
            onClick={handleSubscribeClick}
          >
            Подписаться
          </SpotButton>
        )}

        <CoupleCard
          userData={userData}
          isOwnProfile={isOwnProfile}
          handleCoupleClick={handleCoupleClick}
        />
      </Box>
    </>
  );
}
