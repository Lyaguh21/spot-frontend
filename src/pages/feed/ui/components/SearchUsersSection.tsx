import { SpotActionIcon, SpotTextInput } from "@/shared/ui";
import { Flex, Text } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";

export default function SearchUsersSection() {
  const [isSearch, setIsSearch] = useState(false);
  return (
    <Flex justify="space-between" align="center">
      {!isSearch && (
        <>
          <Text fz={30} fw="bold" c="white">
            Лента
          </Text>
          <SpotActionIcon size={52} onClick={() => setIsSearch(true)}>
            <IconSearch />
          </SpotActionIcon>
        </>
      )}
      {isSearch && (
        <SpotTextInput
          placeholder="Поиск пользователей"
          size="lg"
          radius="lg"
          leftSection={<IconSearch />}
          rightSection={<IconX onClick={() => setIsSearch(false)} />}
        />
      )}
    </Flex>
  );
}
