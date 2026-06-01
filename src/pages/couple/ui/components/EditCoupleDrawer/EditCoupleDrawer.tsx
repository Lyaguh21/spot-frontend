import { SpotButton, SpotDrawer } from "@/shared/ui";
import { SegmentedControl, Stack, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import styles from "./EditCoupleDrawer.module.css";
import { useUpdateCoupleMutation } from "@/entities/couple";

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
          <SpotButton type="submit" size="lg" radius="lg" loading={isLoading}>
            Сохранить
          </SpotButton>
        </Stack>
      </form>
    </SpotDrawer>
  );
}
