import {
  SpotButton,
  SpotDrawer,
  SpotGlassCard,
} from "@/shared/ui";
import { Stack, Text, Box, Flex, Group } from "@mantine/core";
import {
  IconCopy,
  IconCheck,
  IconRefresh,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { SpotCodeInput } from "@/shared/ui";
import {
  useGetCoupleCodeQuery,
  useJoinCoupleMutation,
  useResetCoupleCodeMutation,
} from "@/entities/couple";
import { useNotifications } from "@/shared/lib";
export default function AddCoupleDrawer({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const { showError, showSuccess } = useNotifications();

  const { data } = useGetCoupleCodeQuery();
  const [resetCoupleCode] = useResetCoupleCodeMutation();
  const [joinCouple] = useJoinCoupleMutation();

  const code = data?.inviteCode || "-----";
  const [isCopied, setIsCopied] = useState(false);
  const [pastedCode, setPastedCode] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const pasteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (opened && contentRef.current) {
      contentRef.current.focus();
    }
  }, [opened]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPastedCode(text.trim().slice(0, 6));
    } catch (err) {
      if (pasteInputRef.current) {
        pasteInputRef.current.value = "";
        pasteInputRef.current.focus();
        document.execCommand("paste");
        const pastedValue = pasteInputRef.current.value.trim().slice(0, 6);
        if (pastedValue) {
          setPastedCode(pastedValue);
        }
        contentRef.current?.focus();
      }
    }
  };

  const handleRefreshCode = () => {
    resetCoupleCode();
  };

  const handleJoinCouple = async () => {
    try {
      await joinCouple({
        inviteCode: pastedCode.toUpperCase(),
      }).unwrap();
      showSuccess("Вы успешно присоединились к паре");
      onClose();
    } catch (err: any) {
      showError(err?.data.message || "Не удалось присоединиться к паре");
    }
  };

  return (
    <>
      <input
        ref={pasteInputRef}
        type="text"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        onPaste={(e) => {
          const pastedValue = e.clipboardData
            ?.getData("text")
            .trim()
            .slice(0, 6);
          if (pastedValue) {
            setPastedCode(pastedValue);
          }
        }}
      />
      <SpotDrawer opened={opened} onClose={onClose} title="Добавить пару">
        <Stack gap="md" ref={contentRef} tabIndex={-1}>
          <SpotGlassCard p="lg" bdrs="lg">
            <Box pos="relative">
              <Text c="white" fz="xl" ta="center">
                Ваш код пары
              </Text>

              <Text
                variant="gradient"
                gradient={{ from: "primary.3", to: "blue.6", deg: 130 }}
                ta="center"
                fw={600}
                lh="1.2"
                fz="72"
                style={{ letterSpacing: "0.05em", fontFamily: "monospace" }}
              >
                {code}
              </Text>

              <Group justify="center" gap="sm" mt="md">
                <SpotButton
                  kind="glass"
                  size="lg"
                  h={36}
                  px="sm"
                  leftSection={
                    isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />
                  }
                  onClick={handleCopyCode}
                >
                  Копировать
                </SpotButton>
                <SpotButton
                  kind="glass"
                  h={36}
                  px="sm"
                  onClick={handleRefreshCode}
                  style={{ color: "#ff6b6b" }}
                  leftSection={<IconRefresh size={16} />}
                >
                  <Text>Пересоздать</Text>
                </SpotButton>
              </Group>
            </Box>
          </SpotGlassCard>
          <SpotGlassCard p="lg" bdrs="lg">
            <Text c="white" fz="xl" ta="center" mb="lg">
              Ввести код пары
            </Text>
            <Flex gap="md" align="center" mb="20">
              <Box flex={1}>
                <SpotCodeInput value={pastedCode} onChange={setPastedCode} />
              </Box>
            </Flex>
            <Text c="dimmed" fz="sm" ta="center" mb="md">
              Код состоит из 5 символов: цифры и буквы
            </Text>
            <SpotButton
              fullWidth
              mb="md"
              kind="glass"
              size="md"
              radius="lg"
              onClick={handlePasteCode}
            >
              Вставить из буфера обмена
            </SpotButton>
            <SpotButton
              fullWidth
              size="lg"
              radius="lg"
              onClick={handleJoinCouple}
            >
              Ввести
            </SpotButton>
          </SpotGlassCard>
        </Stack>
      </SpotDrawer>
    </>
  );
}
