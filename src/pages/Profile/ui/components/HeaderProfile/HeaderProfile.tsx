import { useLogoutMutation } from "@/entities/auth";
import { SpotActionIcon, SpotButton } from "@/shared/ui";
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
import { IconEdit, IconLogout } from "@tabler/icons-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import CoupleCard from "../CoupleCard/CoupleCard";

export default function HeaderProfile({
  profileUsername,
  isOwnProfile,
}: {
  profileUsername: string;
  isOwnProfile: boolean;
}) {
  const statistics = [
    { label: "Мест", value: 10 },
    { label: "Подписчики", value: 100 },
    { label: "Подписки", value: 50 },
  ];

  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleEditProfile = () => {};
  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  const handleCoupleClick = () => {};
  const handleSubscribeClick = () => {};

  return (
    <Box className={styles.header}>
      <Flex
        justify={isOwnProfile ? "space-between" : "center"}
        align="center"
        w="100%"
      >
        {isOwnProfile && (
          <SpotActionIcon size={40} onClick={handleLogout}>
            <IconLogout color={theme.colors.red[6]} style={{ marginLeft: 4 }} />
          </SpotActionIcon>
        )}

        <Text fz="lg" c={"dimmedColor.0"}>
          {profileUsername}
        </Text>

        {isOwnProfile && (
          <SpotActionIcon size={40} onClick={handleEditProfile}>
            <IconEdit />
          </SpotActionIcon>
        )}
      </Flex>

      <Flex gap="lg" align="center" mt="lg">
        <Box className={styles.avatarFrame}>
          <Avatar size="120px" className={styles.avatar}>
            {profileUsername.charAt(0)}
          </Avatar>
        </Box>

        <Stack gap={0}>
          <Text fz="32px" c="white">
            Марк
          </Text>
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
              Описание моего профиля Описание моего профиля Описание моего
              профиля
            </Text>
          </Spoiler>
        </Stack>
      </Flex>
      <Group justify="center" mt="xl" gap="xl">
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
        isOwnProfile={isOwnProfile}
        handleCoupleClick={handleCoupleClick}
      />

      {!isOwnProfile && (
        <SpotButton fullWidth mt="xl" size="lg" onClick={handleSubscribeClick}>
          Подписаться
        </SpotButton>
      )}
    </Box>
  );
}
