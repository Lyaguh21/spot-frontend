import { selectUser } from "@/entities/user/model/userSelectors";
import { useAppSelector } from "@/shared/lib";
import { SpotFloatingIndicator } from "@/shared/ui";
import { Box, Flex } from "@mantine/core";
import { useState } from "react";

export default function Map() {
  const user = useAppSelector(selectUser);

  const [value, setValue] = useState("my");

  const data = [
    { label: "Своя", value: "my" },
    { label: "Пара", value: "couple", disabled: !user.coupleId },
    { label: "Друзья", value: "friends" },
  ];
  return (
    <Flex direction="column" h={"calc(100dvh - 80px)"} gap="md" p="md">
      <SpotFloatingIndicator
        items={data}
        value={value}
        setValue={setValue}
        size="lg"
      />

      <Box bdrs="lg" bg={"blue"} flex={1} h="100%" w="100%"></Box>
    </Flex>
  );
}
