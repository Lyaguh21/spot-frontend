import { useParams } from "react-router-dom";
import Header from "./components/Header/Header";
import { Stack } from "@mantine/core";
import { SpotFloatingIndicator } from "@/shared/ui";
import { useEffect, useState } from "react";

import FollowList from "./components/FollowList";
import { useDebouncedValue } from "@mantine/hooks";

export default function Follows() {
  const { type, username } = useParams();
  const initialType = type === "following" ? "following" : "followers";
  const [followType, setFollowType] = useState(initialType);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search.trim(), 200);

  const handleFollowTypeChange = (nextFollowType: string) => {
    setFollowType(nextFollowType);
    setSearch("");
  };

  useEffect(() => {
    if (type === "followers" || type === "following") {
      setFollowType(type);
      setSearch("");
    }
  }, [type]);

  return (
    <Stack gap="md" p="md" style={{ height: "100dvh", overflow: "hidden" }}>
      <Header search={search} onSearchChange={setSearch} />
      <SpotFloatingIndicator
        value={followType}
        setValue={handleFollowTypeChange}
        items={[
          { label: "Подписчики", value: "followers" },
          { label: "Подписки", value: "following" },
        ]}
      />
      <FollowList
        key={`${username}-${followType}-${search}`}
        followType={followType}
        username={username}
        search={debouncedSearch}
      />
    </Stack>
  );
}
