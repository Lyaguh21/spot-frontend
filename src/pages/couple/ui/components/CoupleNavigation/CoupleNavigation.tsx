import { Flex, Text } from "@mantine/core";
import styles from "./CoupleNavigation.module.css";
import { SpotActionIcon } from "@/shared/ui";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function CoupleNavigation({
  generatedName,
  isOwnCouple,
}: {
  generatedName?: string;
  isOwnCouple: boolean;
}) {
  const navigate = useNavigate();

  return (
    <>
      {!isOwnCouple && (
        <SpotActionIcon
          size={40}
          onClick={() => navigate(-1)}
          style={{ position: "absolute", left: 32, top: 32 }}
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
        <Text fz="lg" c="white">
          {generatedName || "Пара"}
        </Text>
        {isOwnCouple && (
          <SpotActionIcon size={40}>
            <IconEdit />
          </SpotActionIcon>
        )}
      </Flex>
    </>
  );
}
