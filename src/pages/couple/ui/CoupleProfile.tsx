import { Box, Spoiler, Stack, Text } from "@mantine/core";
import { Navigate, useParams } from "react-router-dom";
import {
  useGetCoupleByIdQuery,
  useFollowCoupleMutation,
  useUnfollowCoupleMutation,
} from "@/entities/couple";
import { SpotButton } from "@/shared/ui";
import { useAppSelector, useNotifications } from "@/shared/lib";
import styles from "./CoupleProfile.module.css";
import CoupleNavigation from "./components/CoupleNavigation/CoupleNavigation";
import CoupleHero from "./components/CoupleHero/CoupleHero";
import BackToProfileCard from "./components/BackToProfileCard/BackToProfileCard";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import StatisticsProfile from "@/widgets/statistics-profile";

export default function CoupleProfile() {
  const { id } = useParams();
  const {
    data: couple,
    error: coupleError,
    isError: isCoupleError,
  } = useGetCoupleByIdQuery({ id: id ?? "" }, { skip: !id });
  const [followCouple] = useFollowCoupleMutation();
  const [unfollowCouple] = useUnfollowCoupleMutation();
  const { showSuccess, showError } = useNotifications();
  const currentUser = useAppSelector((state) => state.user);
  const members = couple?.members ?? [];

  const derivedName = members
    .map((member) => member.user.name)
    .filter(Boolean)
    .join(" & ");
  const generatedName =
    (couple?.generatedName ?? couple?.displayName ?? derivedName) || "Пара";
  const isOwnCouple =
    Boolean(currentUser.username) &&
    members.some((member) => member.user.username === currentUser.username);

  const handleFollow = async () => {
    if (!id) {
      return;
    }
    if (couple?.isFollowing && !couple?.isPrivate) {
      try {
        await followCouple({ id });
        unfollowCouple({ id });
        showSuccess("Вы отписались от пары");
      } catch (e) {
        showError("Ошибка при отписке от пары");
      }
    } else {
      try {
        await followCouple({ id });
        showSuccess("Вы подписались на пару");
      } catch (e) {
        showError("Ошибка при подписке на пару");
      }
    }
  };

  const status = (coupleError as FetchBaseQueryError | undefined)?.status;
  const isNotFound = !isOwnCouple && isCoupleError && status === 404;
  const isPrivateProfile = !isOwnCouple && couple?.isPrivate;

  if (isNotFound) {
    return <Navigate to="/404" replace />;
  }

  if (isPrivateProfile) {
    return <Navigate to="/closed-profile" replace />;
  }

  return (
    <Stack gap="md" style={{ minHeight: "100dvh" }}>
      <Box className={styles.header}>
        <CoupleNavigation
          coupleId={couple?.id}
          bio={couple?.bio}
          isPrivate={couple?.isPrivate}
          isOwnCouple={isOwnCouple}
          generatedName={generatedName}
        />
        <CoupleHero members={members} />
        {couple?.bio && (
          <Text fz="lg" c="white" mt="xs">
            Описание:
          </Text>
        )}
        <Spoiler
          mb="xl"
          maxHeight={45}
          showLabel="Показать"
          hideLabel="Скрыть"
          classNames={{
            root: styles.spoiler,
            control: styles.spoilerControl,
          }}
        >
          <Text c="dimmed" className={styles.bio}>
            {couple?.bio}
          </Text>
        </Spoiler>

        <StatisticsProfile
          statistics={[
            { label: "Места", value: couple?.placesCount ?? 0 },
            { label: "Подписчики", value: couple?.followersCount ?? 0 },
          ]}
        />
        {!isOwnCouple && (
          <SpotButton
            kind={couple?.isFollowing ? "glass" : "default"}
            fullWidth
            mt="lg"
            size="md"
            radius="lg"
            onClick={handleFollow}
          >
            {couple?.isFollowing ? "Отписаться" : "Подписаться"}
          </SpotButton>
        )}
        {currentUser.username && (
          <BackToProfileCard username={currentUser.username} />
        )}
      </Box>
    </Stack>
  );
}
