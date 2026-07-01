import { SpotAvatar, SpotButton, SpotGlassCard } from "@/shared/ui";
import { Box, Flex, Group, Popover, Spoiler, Stack, Text } from "@mantine/core";
import { OnboardingTour } from "@gfazioli/mantine-onboarding-tour";
import styles from "./HeaderProfile.module.css";
import { IconBan, IconChevronRight, IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import CoupleCard from "@/widgets/couple-card";
import {
  IUserState,
  useFollowToUserMutation,
  useUnfollowUserMutation,
} from "@/entities/user";
import { useDisclosure } from "@mantine/hooks";
import AddCoupleDrawer from "../AddCoupleDrawer/AddCoupleDrawer";
import ProfileNavigation from "@/widgets/profile-navigation";
import StatisticsProfile from "@/widgets/statistics-profile";
import { useNotifications } from "@/shared/lib";
import coupleCardStyles from "@/widgets/couple-card/ui/CoupleCard.module.css";

export default function HeaderProfile({
  userData,
  isOwnProfile,
}: {
  userData?: IUserState;
  isOwnProfile: boolean;
}) {
  const statistics = [
    { label: "Места", value: userData?.stats.places ?? 0 },
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
  const { showSuccess, showError } = useNotifications();
  const [followToUser] = useFollowToUserMutation();
  const [unFollowToUser] = useUnfollowUserMutation();

  const [
    openedCoupleDrawer,
    { open: openCoupleDrawer, close: closeCoupleDrawer },
  ] = useDisclosure(false);

  const navigate = useNavigate();

  const handleCoupleClick = () => {
    if (userData?.partner) {
      navigate({ pathname: `/couple/${userData.coupleId}` });
    } //!
    else {
      openCoupleDrawer();
    }
  };
  const handleSubscribeClick = async () => {
    if (userData?.isFollowing) {
      try {
        await unFollowToUser({
          username: userData?.username ?? "",
        });
        showSuccess("Вы отписались от пользователя");
      } catch (error: any) {
        showError(error?.message ?? "Ошибка при отписке от пользователя");
      }
    } else {
      try {
        await followToUser({
          username: userData?.username ?? "",
        }).unwrap();
        showSuccess("Вы подписались на пользователя");
      } catch (error: any) {
        showError(error?.message ?? "Ошибка при подписке на пользователя");
      }
    }
  };

  return (
    <>
      <AddCoupleDrawer
        opened={openedCoupleDrawer}
        onClose={closeCoupleDrawer}
      />

      <Box className={styles.header}>
        <ProfileNavigation isOwnProfile={isOwnProfile} userData={userData} />

        <Flex gap="lg" align="center" mt="lg">
          <SpotAvatar size="100" src={userData?.avatarUrl}>
            {userData?.username.charAt(0)}
          </SpotAvatar>

          <Stack gap={0}>
            <Group gap={4} align="center">
              <Text fz="32px" c="white" lh={1}>
                {userData?.name}
              </Text>
              {userData?.visibility === "PRIVATE" && (
                <Popover>
                  <Popover.Target>
                    <IconLock />
                  </Popover.Target>
                  <Popover.Dropdown>Это приватный профиль</Popover.Dropdown>
                </Popover>
              )}
              {userData?.isBanned && (
                <Popover>
                  <Popover.Target>
                    <IconBan />
                  </Popover.Target>
                  <Popover.Dropdown>
                    Этот пользователь заблокирован
                  </Popover.Dropdown>
                </Popover>
              )}
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

        <OnboardingTour.Target id="app-tour-profile-follows">
          <Box>
            <StatisticsProfile statistics={statistics} />
          </Box>
        </OnboardingTour.Target>

        {!isOwnProfile && (
          <SpotButton
            kind={userData?.isFollowing ? "glass" : "default"}
            fullWidth
            mt="lg"
            size="md"
            radius="lg"
            onClick={handleSubscribeClick}
          >
            {userData?.isFollowing ? "Отписаться" : "Подписаться"}
          </SpotButton>
        )}

        {isOwnProfile && !userData?.partner ? (
          <OnboardingTour.Target id="app-tour-pair-card">
            <Box mt="lg">
              <SpotGlassCard
                className={coupleCardStyles.pairCard}
                onClick={handleCoupleClick}
                isButton={true}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={2}>
                    <Text c="white" fw={600}>
                      Создать свою пару
                    </Text>
                    <Text c="dimmed" size="sm">
                      Нажмите чтобы добавить партнера
                    </Text>
                  </Stack>
                  <IconChevronRight />
                </Group>
              </SpotGlassCard>
            </Box>
          </OnboardingTour.Target>
        ) : userData?.partner ? (
          <OnboardingTour.Target id="app-tour-pair-card">
            <Box mt="lg">
              <CoupleCard
                firstUser={userData}
                secondUser={userData?.partner}
                subtitle={isOwnProfile ? "Карточка пары" : "Пара пользователя"}
                onClick={handleCoupleClick}
              />
            </Box>
          </OnboardingTour.Target>
        ) : null}
      </Box>
    </>
  );
}
