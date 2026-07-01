import {
  typeBugReportOptions,
  useCreateBugReportMutation,
} from "@/entities/admin";
import { useNotifications } from "@/shared/lib";
import { SpotButton, SpotSelect, SpotTextInput } from "@/shared/ui";
import { SpotTextArea } from "@/shared/ui";
import { SpotPhotoInput } from "@/widgets/spot-photo-input";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function BugReportPage({
  onClose,
  setSelectedOption,
}: {
  onClose: () => void;
  setSelectedOption: (option: "settings" | "bug-report" | "about") => void;
}) {
  const { showError, showSuccess } = useNotifications();
  const [createBugReport] = useCreateBugReportMutation();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      type: "",
      photos: [] as string[],
    },
    validate: {
      title: (value) => (value ? null : "Заполните название"),
      description: (value) => (value ? null : "Заполните описание"),
      type: (value) => (value ? null : "Выберите тип"),
    },
  });

  const onSubmit = async () => {
    try {
      await createBugReport({
        ...form.values,
        photos: form.values.photos.length > 0 ? form.values.photos : undefined,
      }).unwrap();
      await showSuccess("Спасибо за помощь в улучшении нашего сервиса!");
    } catch (error) {
      showError("Что-то пошло не так");
    } finally {
      onClose();
      setSelectedOption("settings");
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack mt="md">
        <SpotTextInput
          size="lg"
          label="Название"
          placeholder="Введите название"
          required
          key={form.key("title")}
          {...form.getInputProps("title")}
        />
        <SpotTextArea
          size="lg"
          label="Описание"
          placeholder="Введите описание"
          maxLength={500}
          minRows={4}
          autosize
          required
          key={form.key("description")}
          {...form.getInputProps("description")}
        />
        <SpotSelect
          size="lg"
          data={typeBugReportOptions}
          label="Тип"
          placeholder="Выберите тип"
          required
          key={form.key("type")}
          {...form.getInputProps("type")}
        />
        <SpotPhotoInput
          multiple
          maxPhoto={5}
          title="Фото"
          description="Добавьте скриншоты или перетащите их сюда"
          value={form.values.photos}
          onChange={(photos) => form.setFieldValue("photos", photos)}
        />
        <SpotButton size="lg" type="submit">
          Отправить
        </SpotButton>
      </Stack>
    </form>
  );
}
