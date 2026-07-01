import {
  markerColorOptions,
  markerIconOptions,
  useUpdateVisitMutation,
} from "@/entities/map";
import type {
  ICreateVisitRequest,
  IMapMarker,
  IMapPlaceVisits,
  IUpdateVisitRequest,
  MarkerColorKey,
  MarkerIconKey,
  visitStatus,
} from "@/entities/map";
import { useNotifications } from "@/shared/lib";
import {
  SpotActionIcon,
  SpotAvatar,
  SpotButton,
  SpotFloatingIndicator,
} from "@/shared/ui";
import { SpotPhotoInput } from "@/widgets/spot-photo-input";
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Rating,
  ScrollArea,
  SimpleGrid,
  Slider,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCheck, IconChevronUp, IconDots } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { VisitRatingParticipant } from "../model/types";
import {
  getDatePickerValue,
  visitInputStyles,
} from "../model/visitInfoHelpers";

type EditVisitFormValues = {
  title: string;
  description: string;
  address: string;
  photos: string[];
  ratings: ICreateVisitRequest["ratings"];
  visitDate: string | null;
  icon: MarkerIconKey;
  color: MarkerColorKey;
  status: visitStatus;
};

type VisitEditPageProps = {
  selectedPlace: IMapPlaceVisits | null;
  visit: IMapMarker;
  participants: VisitRatingParticipant[];
  isCoupleMode: boolean;
  onCancel: () => void;
  onSaved: (visit: IMapMarker) => void;
};

const getInitialValues = (
  visit: IMapMarker,
  selectedPlace: IMapPlaceVisits | null,
): EditVisitFormValues => ({
  title: visit.title,
  description: visit.description ?? "",
  address: visit.address ?? selectedPlace?.place.address ?? "",
  photos: visit.photos ?? [],
  ratings: visit.ratings.length ? visit.ratings : [],
  visitDate: getDatePickerValue(visit.visitDate),
  icon: visit.icon,
  color: visit.color,
  status: visit.status,
});

export function VisitEditPage({
  selectedPlace,
  visit,
  participants,
  isCoupleMode,
  onCancel,
  onSaved,
}: VisitEditPageProps) {
  const { showError, showSuccess } = useNotifications();
  const [updateVisit, { isLoading }] = useUpdateVisitMutation();
  const [colorsIsOpened, setColorsIsOpened] = useState(false);
  const iconByKey = useMemo(
    () => new Map(markerIconOptions.map((option) => [option.key, option])),
    [],
  );
  const colorByKey = useMemo(
    () => new Map(markerColorOptions.map((option) => [option.key, option])),
    [],
  );
  const form = useForm<EditVisitFormValues>({
    initialValues: getInitialValues(visit, selectedPlace),
    validate: {
      title: (value) => (!value.trim() ? "Введите название места" : null),
      visitDate: (value) => (!value ? "Выберите дату посещения" : null),
    },
  });
  const selectedIcon = iconByKey.get(form.values.icon);
  const selectedColor = colorByKey.get(form.values.color);
  const selectionGlowGutter = 28;

  useEffect(() => {
    const nextValues = getInitialValues(visit, selectedPlace);

    form.setValues(nextValues);
    form.resetDirty(nextValues);
  }, [selectedPlace, visit]);

  const getParticipant = (nickname: string) =>
    participants.find((participant) => participant.username === nickname);

  const handleSubmit = async (values: EditVisitFormValues) => {
    if (!visit.id) {
      showError("Не удалось определить визит для редактирования");
      return;
    }

    const lat = visit.lat ?? selectedPlace?.place.lat;
    const lng = visit.lng ?? selectedPlace?.place.lng;

    if (lat === undefined || lng === undefined) {
      showError("Не удалось определить координаты визита");
      return;
    }

    const payload: IUpdateVisitRequest = {
      title: values.title.trim(),
      address: values.address.trim(),
      photos: values.photos,
      description: values.description.trim(),
      ratings: values.ratings,
      visitDate: new Date(values.visitDate ?? new Date()).toISOString(),
      icon: values.icon,
      color: values.color,
      status: values.status,
      isFavorite: visit.isFavorite,
    };

    try {
      const updatedVisit = await updateVisit({
        visitId: visit.id,
        body: payload,
      }).unwrap();
      showSuccess("Метка обновлена");
      onSaved({ ...visit, ...updatedVisit, id: visit.id });
    } catch (error: any) {
      showError(error.message ?? "Не удалось обновить метку");
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={18}>
        <Divider
          color="rgba(104, 132, 210, 0.16)"
          label="Редактирование метки"
          labelPosition="center"
        />

        <Stack gap={8} style={{ overflow: "visible" }}>
          <Group justify="space-between" align="center">
            <Text c="#8ea2d4" size="xs" fw={700}>
              Иконка
            </Text>
            <Text c="#c9d7ff" size="xs" fw={700}>
              {selectedIcon?.label}
            </Text>
          </Group>

          <ScrollArea
            type="never"
            offsetScrollbars={false}
            scrollbarSize={0}
            styles={{
              root: {
                marginBlock: -selectionGlowGutter,
                marginInline: -selectionGlowGutter,
                width: `calc(100% + ${selectionGlowGutter * 2}px)`,
              },
              viewport: {
                paddingBlock: selectionGlowGutter,
                paddingInline: selectionGlowGutter,
              },
            }}
          >
            <Group gap={10} wrap="nowrap">
              {markerIconOptions.map((option) => {
                const isSelected = form.values.icon === option.key;

                return (
                  <ActionIcon
                    key={option.key}
                    type="button"
                    aria-label={option.label}
                    title={option.label}
                    variant="transparent"
                    radius="xl"
                    size={48}
                    color="violet"
                    onClick={() => form.setFieldValue("icon", option.key)}
                    style={{
                      flex: "0 0 auto",
                      color: isSelected ? "#67e8f9" : "#c084fc",
                      background: isSelected
                        ? "rgba(21, 42, 89, 0.96)"
                        : "rgba(20, 29, 68, 0.74)",
                      border: isSelected
                        ? "1px solid rgba(103, 232, 249, 0.72)"
                        : "1px solid rgba(104, 132, 210, 0.18)",
                      boxShadow: isSelected
                        ? "0 0 22px rgba(34, 211, 238, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.14)"
                        : "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
                      overflow: "visible",
                    }}
                  >
                    {option.icon}
                  </ActionIcon>
                );
              })}
            </Group>
          </ScrollArea>
        </Stack>

        <Stack gap={8} style={{ overflow: "visible" }}>
          <Group
            justify="space-between"
            align="center"
            style={{ overflow: "visible" }}
          >
            <Text c="#8ea2d4" size="xs" fw={700}>
              Цвет метки
            </Text>
            <Text c="#c9d7ff" size="xs" fw={700}>
              {selectedColor?.label}
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 6, xs: 6, sm: 9 }} spacing={8}>
            {markerColorOptions
              .map((option) => {
                const isSelected = form.values.color === option.key;

                return (
                  <ActionIcon
                    key={option.key}
                    type="button"
                    aria-label={option.label}
                    title={option.label}
                    radius="xl"
                    size={46}
                    variant="transparent"
                    onClick={() => form.setFieldValue("color", option.key)}
                    style={{
                      color: "#ffffff",
                      background: `linear-gradient(135deg, ${option.colors[0]}, ${option.colors[1]})`,
                      border: isSelected
                        ? "2px solid rgba(234, 241, 255, 0.95)"
                        : "1px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: isSelected
                        ? `0 0 22px ${option.colors[0]}88`
                        : "0 8px 18px rgba(3, 9, 28, 0.28)",
                      overflow: "visible",
                    }}
                  >
                    {isSelected && <IconCheck size={20} stroke={2.7} />}
                  </ActionIcon>
                );
              })
              .slice(0, colorsIsOpened ? undefined : 5)}
            <SpotActionIcon
              size={48}
              type="button"
              onClick={() => setColorsIsOpened((opened) => !opened)}
              aria-label={
                colorsIsOpened ? "Свернуть цвета" : "Показать все цвета"
              }
              title={colorsIsOpened ? "Свернуть цвета" : "Показать все цвета"}
            >
              {colorsIsOpened ? <IconChevronUp /> : <IconDots />}
            </SpotActionIcon>
          </SimpleGrid>
        </Stack>

        <SpotPhotoInput
          multiple
          maxPhoto={5}
          title="Фото"
          description="Добавьте фото места или перетащите их сюда"
          value={form.values.photos}
          onChange={(photos) => form.setFieldValue("photos", photos)}
        />

        <TextInput
          label="Название места"
          placeholder="Например, Уютное кафе"
          maxLength={80}
          rightSection={
            <Text c="#7f91c4" size="xs">
              {form.values.title.length}/80
            </Text>
          }
          rightSectionWidth={56}
          styles={visitInputStyles}
          key={form.key("title")}
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Описание"
          placeholder="Что здесь особенного?"
          autosize
          minRows={3}
          maxRows={5}
          maxLength={300}
          rightSection={
            <Text c="#7f91c4" size="xs">
              {form.values.description.length}/300
            </Text>
          }
          rightSectionWidth={64}
          styles={visitInputStyles}
          key={form.key("description")}
          {...form.getInputProps("description")}
        />

        {form.values.ratings.length > 0 && (
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={12}>
            {form.values.ratings.map((rating, index) => {
              const participant = getParticipant(rating.nickname);

              return (
                <Stack key={rating.nickname} gap={7}>
                  <Text c="#8ea2d4" size="xs" fw={700}>
                    Оценка места
                  </Text>
                  <Stack
                    p={12}
                    align="center"
                    style={{
                      borderRadius: 14,
                      background: "rgba(14, 27, 62, 0.74)",
                      border: "1px solid rgba(104, 132, 210, 0.22)",
                    }}
                  >
                    <Group w="100%" gap={10} wrap="nowrap">
                      <SpotAvatar
                        size={40}
                        radius="xl"
                        src={participant?.avatarUrl}
                        alt={participant?.name ?? rating.nickname}
                      >
                        {rating.nickname.charAt(0).toUpperCase()}
                      </SpotAvatar>
                      <Stack gap={0} style={{ minWidth: 0 }}>
                        <Text c="#eaf1ff" size="sm" fw={700} truncate>
                          {participant?.name ?? rating.nickname}
                        </Text>
                        <Text c="#8ea2d4" size="xs" truncate>
                          @{rating.nickname}
                        </Text>
                      </Stack>
                    </Group>
                    <Rating
                      color="#facc15"
                      size="lg"
                      fractions={4}
                      value={rating.rating}
                      onChange={(value) =>
                        form.setFieldValue(`ratings.${index}.rating`, value)
                      }
                    />
                    <Slider
                      w="100%"
                      min={0}
                      max={5}
                      step={0.25}
                      value={rating.rating}
                      onChange={(value) =>
                        form.setFieldValue(`ratings.${index}.rating`, value)
                      }
                      label={(value) => value.toFixed(2)}
                    />
                  </Stack>
                </Stack>
              );
            })}
          </SimpleGrid>
        )}

        <SpotFloatingIndicator
          value={form.values.status}
          label="Статус"
          setValue={(value: visitStatus) => form.setFieldValue("status", value)}
          items={[
            {
              value: "VISITED",
              label: isCoupleMode ? "Посетили" : "Посетил(а)",
            },
            { value: "PLANNED", label: "В планах" },
          ]}
        />

        <Divider
          color="rgba(104, 132, 210, 0.16)"
          label="Дополнительные поля"
          labelPosition="center"
        />

        <DatePickerInput
          label="Дата визита"
          valueFormat="DD.MM.YYYY"
          styles={visitInputStyles}
          key={form.key("visitDate")}
          {...form.getInputProps("visitDate")}
        />

        <TextInput
          label="Адрес"
          placeholder="Москва, Крымский Вал, 9"
          styles={visitInputStyles}
          key={form.key("address")}
          {...form.getInputProps("address")}
        />

        <Group grow wrap="nowrap">
          <SpotButton
            kind="glass"
            radius="lg"
            type="button"
            disabled={isLoading}
            onClick={onCancel}
          >
            Отмена
          </SpotButton>
          <SpotButton
            radius="lg"
            type="submit"
            disabled={!visit.id || isLoading}
            loading={isLoading}
          >
            Сохранить
          </SpotButton>
        </Group>
      </Stack>
    </Box>
  );
}
