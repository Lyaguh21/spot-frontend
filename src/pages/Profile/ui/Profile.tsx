import { selectUser } from "@/entities/user/model/userSelectors";
import { useAppSelector } from "@/shared/lib";
import { Navigate, useParams } from "react-router-dom";
import HeaderProfile from "./components/HeaderProfile/HeaderProfile";

import { Box } from "@mantine/core";
import { useGetProfileQuery, useGetUserByUsernameQuery } from "@/entities/user";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function Profile() {
  //? Получение данных нужного пользователя
  const { username } = useParams();
  const user = useAppSelector(selectUser);
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

  //? Редирект на 404
  const status = (userByUsernameError as FetchBaseQueryError | undefined)
    ?.status;
  const isNotFound = !isOwnProfile && isUserByUsernameError && status === 404;

  if (isNotFound) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Box h="100%">
        <HeaderProfile isOwnProfile={isOwnProfile} userData={data} />
      </Box>
    </>
  );
}
