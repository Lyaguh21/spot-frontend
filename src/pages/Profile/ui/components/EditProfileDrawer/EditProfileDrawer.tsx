import { SpotButton, SpotDrawer, SpotTextInput } from "@/shared/ui";
import { SegmentedControl, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import {
  UserVisibility,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/entities/user";
import styles from "./EditProfileDrawer.module.css";
import { SpotPhotoInput } from "@/widgets/spot-photo-input";
import { useNotifications } from "@/shared/lib";

type EditProfileFormValues = {
  name?: string;
  bio?: string;
  visibility: UserVisibility;
  avatarUrl?: string;
};

const initialValues: EditProfileFormValues = {
  name: undefined,
  bio: undefined,
  visibility: "PUBLIC",
  avatarUrl: undefined,
};

export default function EditProfileDrawer({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const { showSuccess, showError } = useNotifications();
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm<EditProfileFormValues>({
    initialValues,
  });

  useEffect(() => {
    if (!opened || !profile) {
      return;
    }

    const nextValues = {
      name: profile.name ?? "",
      bio: profile.bio ?? "",
      visibility: profile.visibility ?? "PUBLIC",
      avatarUrl: profile.avatarUrl,
    };

    form.setValues(nextValues);
    form.resetDirty(nextValues);
  }, [opened, profile]);

  const handleSubmit = async (values: EditProfileFormValues) => {
    const payload = {
      name: values.name?.trim(),
      bio: values.bio?.trim(),
      visibility: values.visibility,
      avatarUrl: values.avatarUrl,
    };

    try {
      await updateProfile(payload).unwrap();
      showSuccess("Профиль успешно обновлен");
    } catch (err: any) {
      showError(err?.data?.message || "Не удалось обновить профиль");
    } finally {
      onClose();
    }
  };

  return (
    <SpotDrawer
      size="80%"
      opened={opened}
      onClose={onClose}
      title="Редактирование профиля"
    >
      <form className={styles.form} onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <SpotPhotoInput
            title="Аватар"
            maxSizeMb={5}
            description="Выберите аватарку или перетащите ее сюда"
            value={form.values.avatarUrl}
            onChange={(photo) => form.setFieldValue("avatarUrl", photo ?? "")}
          />

          <SpotTextInput
            label="Имя"
            radius="lg"
            {...form.getInputProps("name")}
            placeholder="Ваше имя"
          />
          <Textarea
            radius="lg"
            label="Описание"
            placeholder="Коротко о себе"
            minRows={3}
            {...form.getInputProps("bio")}
            classNames={{
              label: styles.label,
              input: styles.textareaInput,
            }}
          />
          <SegmentedControl
            value={form.values.visibility}
            radius="lg"
            onChange={(value) =>
              form.setFieldValue("visibility", value as UserVisibility)
            }
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
