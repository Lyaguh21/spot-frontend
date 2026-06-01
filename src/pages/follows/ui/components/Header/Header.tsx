import { SpotActionIcon, SpotTextInput } from "@/shared/ui";
import { Flex } from "@mantine/core";
import { IconArrowLeft, IconSearch, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function Header({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
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
        value={search}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        leftSection={<IconSearch />}
        rightSection={
          search ? (
            <SpotActionIcon size={28} onClick={() => onSearchChange("")}>
              <IconX size={16} />
            </SpotActionIcon>
          ) : undefined
        }
      />
    </Flex>
  );
}
