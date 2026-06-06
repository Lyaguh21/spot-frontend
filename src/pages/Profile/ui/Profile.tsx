import { selectUser } from "@/entities/user/model/userSelectors";
import { useAppSelector } from "@/shared/lib";
import { Navigate, useParams } from "react-router-dom";
import HeaderProfile from "./components/HeaderProfile/HeaderProfile";

import { Box, Stack } from "@mantine/core";
import { useGetProfileQuery, useGetUserByUsernameQuery } from "@/entities/user";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useGetVisitsByUsernameQuery } from "@/entities/map";
import MapContainer from "@/widgets/map-container";
import styles from "./Profile.module.css";
import { selectView } from "@/entities/view";

export default function Profile() {
  //? Получение данных нужного пользователя
  const { username } = useParams();
  const user = useAppSelector(selectUser);
  const viewState = useAppSelector(selectView);
  const isOwnProfile = !username || username === user.username;
  const { data: ownProfileData } = useGetProfileQuery(undefined, {
    skip: !isOwnProfile,
  });
  const {
    data: userByUsernameData,
    error: userByUsernameError,
    isError: isUserByUsernameError,
  } = useGetUserByUsernameQuery(
    { username: username ?? "" },
    { skip: !username },
  );
  const data = isOwnProfile ? ownProfileData : userByUsernameData;
  const { data: visits } = useGetVisitsByUsernameQuery(
    { username: data?.username ?? "" },
    { skip: !data?.username },
  );

  //? Редирект на 404
  const status = (userByUsernameError as FetchBaseQueryError | undefined)
    ?.status;
  const isNotFound = !isOwnProfile && isUserByUsernameError && status === 404;
  const isPrivateProfile = !isOwnProfile && data?.isPrivate;

  if (isNotFound) {
    return <Navigate to="/404" replace />;
  }

  if (isPrivateProfile) {
    return <Navigate to="/closed-profile" replace />;
  }

  return (
    <Stack
      gap={viewState.ui.mapIsFullScreen ? 0 : "md"}
      className={styles.page}
      data-fullscreen={viewState.ui.mapIsFullScreen || undefined}
      style={{ transition: "all 0.4s ease-in-out" }}
    >
      {!viewState.ui.mapIsFullScreen && (
        <Box>
          <HeaderProfile isOwnProfile={isOwnProfile} userData={data} />
        </Box>
      )}
      <Box
        className={styles.mapIsland}
        data-fullscreen={viewState.ui.mapIsFullScreen || undefined}
      >
        <MapContainer dataMarkers={visits} visited />
      </Box>
    </Stack>
  );
}
