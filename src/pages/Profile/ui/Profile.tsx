import { selectUser } from "@/entities/user/model/userSelectors";
import { useAppSelector } from "@/shared/lib";
import { SpotActionIcon } from "@/shared/ui";
import { ActionIcon, Box, Group, useMantineTheme } from "@mantine/core";
import { IconDoorExit, IconEdit, IconLogout } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import HeaderProfile from "./components/HeaderProfile/HeaderProfile";
import { useLogoutMutation } from "@/entities/auth";

export default function Profile() {
  const { username } = useParams();
  const user = useAppSelector(selectUser);

  const isOwnProfile = !username || username === user.username;
  const profileUsername = username || user.username;

  return (
    //!
    <Box h="100%">
      <HeaderProfile
        isOwnProfile={isOwnProfile}
        profileUsername={profileUsername}
      />
    </Box>
  );
}
