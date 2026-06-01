import { useParams } from "react-router-dom";
import Header from "./components/Header/Header";
import { Stack } from "@mantine/core";
import { SpotFloatingIndicator } from "@/shared/ui";
import { useEffect, useState } from "react";

import { useGetFollowersQuery, useGetFollowingsQuery } from "@/entities/user";
import FollowList from "./components/FollowList";

export default function Follows() {
  const { type, username } = useParams();
  const initialType = type === "following" ? "following" : "followers";
  const [followType, setFollowType] = useState(initialType);
  const { data: followersData } = useGetFollowersQuery(
    {
      username: username ?? "",
    },
    { skip: !username || followType !== "followers" },
  );
  const { data: followingsData } = useGetFollowingsQuery(
    {
      username: username ?? "",
    },
    { skip: !username || followType !== "following" },
  );

  useEffect(() => {
    if (type === "followers" || type === "following") {
      setFollowType(type);
    }
  }, [type]);

  return (
    <Stack gap="md" p="md" style={{ minHeight: "100dvh" }}>
      <Header />
      <SpotFloatingIndicator
        value={followType}
        setValue={setFollowType}
        items={[
          { label: "Подписчики", value: "followers" },
          { label: "Подписки", value: "following" },
        ]}
      />
      <FollowList
        followType={followType}
        followers={followersData}
        followings={followingsData}
      />
    </Stack>
  );
}
