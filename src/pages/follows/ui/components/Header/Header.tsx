import { SpotActionIcon, SpotTextInput } from "@/shared/ui";
import { Flex } from "@mantine/core";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <Flex justify="space-between" gap="md">
      <SpotActionIcon size="50px" onClick={() => navigate(-1)}>
        <IconArrowLeft />
      </SpotActionIcon>
      <SpotTextInput
        radius="lg"
        size="lg"
        placeholder="Поиск пользователей"
        leftSection={<IconSearch />}
      />
    </Flex>
  );
}
