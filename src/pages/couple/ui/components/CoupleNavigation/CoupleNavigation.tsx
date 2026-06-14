import { Flex, Text } from "@mantine/core";
import styles from "./CoupleNavigation.module.css";
import { SpotActionIcon } from "@/shared/ui";
import { IconArrowLeft, IconEdit, IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import EditCoupleDrawer from "../EditCoupleDrawer/EditCoupleDrawer";
import { useDisclosure } from "@mantine/hooks";

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
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

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
        <Flex align="center" gap={4}>
          <Text fz="lg">{generatedName || "Пара"}</Text>
          {isPrivate && <IconLock size={18} />}
        </Flex>
        {isOwnCouple && (
          <SpotActionIcon size={40} onClick={open}>
            <IconEdit />
          </SpotActionIcon>
        )}
      </Flex>
    </>
  );
}
