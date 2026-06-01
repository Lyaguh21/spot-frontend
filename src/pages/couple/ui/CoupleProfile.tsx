import { Box, Spoiler, Stack, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import {
  useGetCoupleByIdQuery,
  useFollowCoupleMutation,
} from "@/entities/couple";
import { SpotButton } from "@/shared/ui";
import { useAppSelector, useNotifications } from "@/shared/lib";
import styles from "./CoupleProfile.module.css";
import CoupleNavigation from "./components/CoupleNavigation/CoupleNavigation";
import CoupleHero from "./components/CoupleHero/CoupleHero";
import BackToProfileCard from "./components/BackToProfileCard/BackToProfileCard";

export default function CoupleProfile() {
  const { id } = useParams();
  const { data: couple } = useGetCoupleByIdQuery(
    { id: id ?? "" },
    { skip: !id },
  );
  const [followCouple] = useFollowCoupleMutation();
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

    try {
      await followCouple({ id });
      showSuccess("Вы подписались на пару");
    } catch {
      showError("Ошибка при подписке на пару");
    }
  };

  return (
    <Stack gap="md" style={{ minHeight: "100dvh" }}>
      <Box className={styles.header}>
        <CoupleNavigation
          isOwnCouple={isOwnCouple}
          generatedName={generatedName}
        />
        <CoupleHero members={members} />
        {couple?.description && (
          <Text fz="lg" c="white">
            Описание:
          </Text>
        )}
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
            {couple?.description}
          </Text>
        </Spoiler>
        {!isOwnCouple && (
          <SpotButton
            fullWidth
            mt="lg"
            size="md"
            radius="lg"
            onClick={handleFollow}
          >
            Подписаться
          </SpotButton>
        )}
        {currentUser.username && (
          <BackToProfileCard username={currentUser.username} />
        )}
      </Box>
    </Stack>
  );
}
