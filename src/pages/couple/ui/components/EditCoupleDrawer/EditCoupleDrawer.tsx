import { SpotButton, SpotDrawer } from "@/shared/ui";
import { Button, SegmentedControl, Stack, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import styles from "./EditCoupleDrawer.module.css";
import {
  useLeaveCoupleMutation,
  useUpdateCoupleMutation,
} from "@/entities/couple";
import { useNotifications } from "@/shared/lib";

export default function EditCoupleDrawer({
  opened,
  onClose,
  coupleId,
  initialBio,
  initialIsPrivate,
}: {
  opened: boolean;
  onClose: () => void;
  coupleId?: string;
  initialBio?: string;
  initialIsPrivate?: boolean;
}) {
  const [updateCouple, { isLoading }] = useUpdateCoupleMutation();
  const [leaveCouple, { isLoading: isLeaving }] = useLeaveCoupleMutation();
  const { showSuccess, showError } = useNotifications();

  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate ?? false);

  useEffect(() => {
    if (!opened) {
      return;
    }
    setBio(initialBio ?? "");
    setIsPrivate(initialIsPrivate ?? false);
  }, [opened, initialBio, initialIsPrivate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!coupleId) {
      return;
    }

    const payload = {
      id: coupleId,
      bio: bio.trim(),
      isPrivate: isPrivate,
    };

    try {
      await updateCouple(payload).unwrap();
      onClose();
    } catch {}
  };

  const handleLeaveCouple = async () => {
    try {
      leaveCouple({ id: coupleId ?? "" }).unwrap();
      showSuccess("Вы покинули пару");
      onClose();
    } catch (e) {
      showError("Ошибка при покидании пары");
    }
  };

  return (
    <SpotDrawer
      size="80%"
      opened={opened}
      onClose={onClose}
      title="Редактирование карточки пары"
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Stack gap="md">
          <Textarea
            radius="lg"
            label="Описание"
            value={bio}
            onChange={(event) => setBio(event.currentTarget.value)}
            placeholder="Коротко о вас"
            minRows={3}
            classNames={{
              label: styles.label,
              input: styles.textareaInput,
            }}
          />
          <SegmentedControl
            value={isPrivate ? "PRIVATE" : "PUBLIC"}
            radius="lg"
            onChange={(value) => setIsPrivate(value === "PRIVATE")}
            data={[
              { label: "Публичный", value: "PUBLIC" },
              { label: "Приватный", value: "PRIVATE" },
            ]}
            classNames={{
              root: styles.segmentedRoot,
              control: styles.segmentedControl,
              label: styles.segmentedLabel,
              indicator: styles.segmentedIndicator,
            }}
          />
          <Button
            type="submit"
            color="red.5"
            variant="outline"
            size="lg"
            radius="lg"
            loading={isLeaving}
            onClick={handleLeaveCouple}
          >
            Покинуть пару
          </Button>
          <SpotButton type="submit" size="lg" radius="lg" loading={isLoading}>
            Сохранить
          </SpotButton>
        </Stack>
      </form>
    </SpotDrawer>
  );
}
