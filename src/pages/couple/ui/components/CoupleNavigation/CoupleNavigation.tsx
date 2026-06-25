import { Flex, Menu, Text } from "@mantine/core";
import styles from "./CoupleNavigation.module.css";
import { SpotActionIcon } from "@/shared/ui";
import {
  IconArrowLeft,
  IconCopy,
  IconEdit,
  IconLock,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import EditCoupleDrawer from "../EditCoupleDrawer/EditCoupleDrawer";
import { useDisclosure } from "@mantine/hooks";
import { useNotifications } from "@/shared/lib";

export default function CoupleNavigation({
  coupleId,
  generatedName,
  isOwnCouple,
  bio,
  isPrivate,
}: {
  coupleId?: string;
  bio?: string;
  isPrivate?: boolean;
  generatedName?: string;
  isOwnCouple: boolean;
}) {
  const { showError, showSuccess } = useNotifications();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const handleCopyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess("Ссылка скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  };

  return (
    <>
      <EditCoupleDrawer
        opened={opened}
        onClose={close}
        coupleId={coupleId}
        initialBio={bio}
        initialIsPrivate={isPrivate}
      />

      {!isOwnCouple && (
        <SpotActionIcon
          size={45}
          onClick={() => navigate(-1)}
          style={{ position: "absolute", left: 32, top: 16 }}
        >
          <IconArrowLeft />
        </SpotActionIcon>
      )}

      <Flex
        className={styles.nameRow}
        justify={isOwnCouple ? "space-between" : "center"}
        align="center"
        w={isOwnCouple ? "100%" : "fit-content"}
        mx={isOwnCouple ? undefined : "auto"}
      >
        {isOwnCouple && (
          <SpotActionIcon size={40} onClick={() => navigate(-1)}>
            <IconArrowLeft />
          </SpotActionIcon>
        )}
        <Menu shadow="lg" width={220} position="bottom" withinPortal>
          <Menu.Target>
            <Flex align="center" gap={4}>
              <Text fz="lg">{generatedName || "Пара"}</Text>
              {isPrivate && <IconLock size={18} />}
            </Flex>
          </Menu.Target>
          <Menu.Dropdown className={styles.menuDropdown}>
            <Menu.Item
              leftSection={<IconCopy size={17} />}
              onClick={handleCopyCurrentUrl}
            >
              Скопировать ссылку
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {isOwnCouple && (
          <SpotActionIcon size={40} onClick={open}>
            <IconEdit />
          </SpotActionIcon>
        )}
      </Flex>
    </>
  );
}
