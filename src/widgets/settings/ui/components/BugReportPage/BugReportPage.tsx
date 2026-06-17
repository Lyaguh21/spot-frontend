import {
  typeBugReportOptions,
  useCreateBugReportMutation,
} from "@/entities/admin";
import { useNotifications } from "@/shared/lib";
import { SpotButton, SpotSelect, SpotTextInput } from "@/shared/ui";
import { SpotTextArea } from "@/shared/ui";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function BugReportPage() {
  const { showError, showSuccess } = useNotifications();
  const [createBugReport] = useCreateBugReportMutation();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      type: "",
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
        photos: undefined,
      }).unwrap();
      await showSuccess("Спасибо за помощь в улучшении нашего сервиса!");
    } catch (error) {
      showError("Что-то пошло не так");
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
        <SpotButton size="lg" type="submit">
          Отправить
        </SpotButton>
      </Stack>
    </form>
  );
}
