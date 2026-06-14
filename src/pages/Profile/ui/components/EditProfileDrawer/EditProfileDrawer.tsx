import { SpotAvatar, SpotButton, SpotDrawer, SpotTextInput } from "@/shared/ui";
import {
  Group,
  SegmentedControl,
  Stack,
  Textarea,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/entities/user";
import styles from "./EditProfileDrawer.module.css";

export default function EditProfileDrawer({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!opened || !profile) {
      return;
    }

    setName(profile.name ?? "");
    setBio(profile.bio ?? "");
    setIsPrivate(profile.isPrivate ?? false);
    setAvatarUrl(profile.avatarUrl ?? "");
    setAvatarPreview(profile.avatarUrl ?? null);
  }, [opened, profile]);

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      bio: bio.trim(),
      isPrivate,
      ...(avatarUrl ? { avatarUrl } : {}),
    };

    try {
      await updateProfile(payload).unwrap();
      onClose();
    } catch {}
  };

  return (
    <SpotDrawer
      size="80%"
      opened={opened}
      onClose={onClose}
      title="Редактирование профиля"
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Group justify="center" mt="xl">
          <div className={styles.avatarFrame}>
            <SpotAvatar
              src={avatarPreview}
              size={92}
              onClick={handleChooseAvatar}
            >
              {profile?.username?.charAt(0)}
            </SpotAvatar>
            <div className={styles.avatarButton}>
              <IconPhoto size={18} />
            </div>
          </div>
        </Group>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
        />

        <Stack gap="md">
          <SpotTextInput
            label="Имя"
            radius="lg"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Ваше имя"
          />
          <Textarea
            radius="lg"
            label="Описание"
            value={bio}
            onChange={(event) => setBio(event.currentTarget.value)}
            placeholder="Коротко о себе"
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
