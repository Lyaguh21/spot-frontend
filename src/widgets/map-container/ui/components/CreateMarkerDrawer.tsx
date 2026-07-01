import "dayjs/locale/ru";
import {
  ICreateVisitRequest,
  IMapMarker,
  MarkerColorKey,
  MarkerIconKey,
  markerColorOptions,
  markerIconOptions,
  useCreateVisitMutation,
  visitStatus,
} from "@/entities/map";
import { selectUser } from "@/entities/user";
import { selectView } from "@/entities/view";
import { useAppSelector, useNotifications } from "@/shared/lib";
import {
  SpotActionIcon,
  SpotAvatar,
  SpotButton,
  SpotDrawer,
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

type CreateMarkerFormValues = {
  title: string;
  lat: number;
  lng: number;
  description: string;
  address?: string;
  photos: string[];
  coupleId?: string;
  ratings: ICreateVisitRequest["ratings"];
  visitDate: string;
  icon: MarkerIconKey;
  color: MarkerColorKey;
};

type CreateMarkerDraft = Pick<
  IMapMarker,
  "externalId" | "title" | "lat" | "lng"
> &
  Partial<Pick<IMapMarker, "description" | "icon" | "color">>;

type RatingParticipant = {
  nickname: string;
  name?: string;
  avatarUrl?: string;
};

const inputStyles = {
  label: {
    color: "#8ea2d4",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  input: {
    minHeight: 44,
    color: "#eaf1ff",
    backgroundColor: "rgba(14, 27, 62, 0.74)",
    border: "1px solid rgba(104, 132, 210, 0.22)",
    borderRadius: 14,
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  },
};

const getLocalDateTimeValue = (date = new Date()) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const getInitialValues = (
  marker: CreateMarkerDraft | null,
  ratings: ICreateVisitRequest["ratings"],
  coupleId?: string,
): CreateMarkerFormValues => ({
  title: marker?.title ?? "",
  lat: marker?.lat ?? 0,
  lng: marker?.lng ?? 0,
  address: "",
  photos: [],
  coupleId,
  description: marker?.description ?? "",
  ratings,
  visitDate: getLocalDateTimeValue(),
  icon: marker?.icon ?? markerIconOptions[0].key,
  color: marker?.color ?? markerColorOptions[0].key,
});

export default function CreateMarkerDrawer({
  marker,
  opened,
  onClose,
  onCreated,
}: {
  marker: CreateMarkerDraft | null;
  opened: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const user = useAppSelector(selectUser);
  const viewState = useAppSelector(selectView);
  const [createVisit, { isLoading }] = useCreateVisitMutation();
  const { showError, showSuccess } = useNotifications();
  const [status, setStatus] = useState<visitStatus>("VISITED");
  const isCoupleMode = viewState.map.createMode === "couple";

  const iconByKey = useMemo(
    () => new Map(markerIconOptions.map((option) => [option.key, option])),
    [],
  );
  const colorByKey = useMemo(
    () => new Map(markerColorOptions.map((option) => [option.key, option])),
    [],
  );

  const [colorsIsOpened, setColorsIsOpened] = useState(false);
  const ratingParticipants = useMemo<RatingParticipant[]>(() => {
    const currentUser = {
      nickname: user.username ?? "",
      name: user.name,
      avatarUrl: user.avatarUrl,
    };

    if (isCoupleMode && user.partner) {
      return [
        currentUser,
        {
          nickname: user.partner.username,
          name: user.partner.name,
          avatarUrl: user.partner.avatarUrl,
        },
      ].filter((participant) => Boolean(participant.nickname));
    }

    return currentUser.nickname ? [currentUser] : [];
  }, [
    user.avatarUrl,
    user.name,
    user.partner,
    user.username,
    viewState.map.createMode,
  ]);
  const initialRatings = useMemo(
    () =>
      ratingParticipants.map((participant) => ({
        nickname: participant.nickname,
        rating: 5,
      })),
    [ratingParticipants],
  );
  const initialCoupleId =
    isCoupleMode && user.coupleId ? String(user.coupleId) : undefined;
  const form = useForm<CreateMarkerFormValues>({
    initialValues: getInitialValues(marker, initialRatings, initialCoupleId),
    validate: {
      title: (value) => (!value.trim() ? "Введите название места" : null),
      visitDate: (value) => (!value ? "Выберите дату посещения" : null),
    },
  });

  useEffect(() => {
    if (opened) {
      const nextValues = getInitialValues(
        marker,
        initialRatings,
        initialCoupleId,
      );

      form.setValues(nextValues);
      form.resetDirty(nextValues);
    }
  }, [initialCoupleId, initialRatings, marker, opened]);

  const selectedIcon = iconByKey.get(form.values.icon);
  const selectedColor = colorByKey.get(form.values.color);
  const selectionGlowGutter = 28;

  const handleSubmit = async (values: CreateMarkerFormValues) => {
    const payload: ICreateVisitRequest = {
      ownerType: isCoupleMode ? "COUPLE" : "USER",
      title: values.title.trim(),
      lat: values.lat,
      lng: values.lng,
      address: values.address?.trim() || undefined,
      photos: values.photos.length > 0 ? values.photos : undefined,
      coupleId:
        isCoupleMode && user.coupleId ? String(user.coupleId) : undefined,
      description: values.description.trim(),
      ratings: values.ratings,
      visitDate: new Date(values.visitDate).toISOString(),
      icon: values.icon,
      color: values.color,
      status,
    };

    try {
      await createVisit({ body: payload }).unwrap();
      showSuccess("Метка успешно создана");
      onCreated?.();
      onClose();
    } catch (error: any) {
      showError(error.message ?? "Не удалось создать метку");
    }
  };

  return (
    <SpotDrawer opened={opened} onClose={onClose} title="Добавить место">
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={18}>
          <Divider
            color="rgba(104, 132, 210, 0.16)"
            label="Основные поля"
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
                  width: `calc(100% + ${selectionGlowGutter * 1}px)`,
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

            <SimpleGrid
              cols={{ base: 6, xs: 6, sm: 9 }}
              spacing={8}
              style={{
                overflow: "visible",
              }}
            >
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
                onClick={() => setColorsIsOpened(!colorsIsOpened)}
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
            placeholder="Шаурма от души"
            maxLength={80}
            rightSection={
              <Text c="#7f91c4" size="xs">
                {form.values.title.length}/80
              </Text>
            }
            rightSectionWidth={56}
            styles={inputStyles}
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
            styles={inputStyles}
            key={form.key("description")}
            {...form.getInputProps("description")}
          />

          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={12}>
            {form.values.ratings.map((rating, index) => {
              const participant = ratingParticipants[index];

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
                        {(participant?.name ?? rating.nickname)
                          .charAt(0)
                          .toUpperCase()}
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

          <SpotFloatingIndicator
            value={status}
            label="Статус"
            setValue={setStatus}
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
            locale="ru"
            valueFormat="DD MMM YYYY"
            styles={inputStyles}
            key={form.key("visitDate")}
            {...form.getInputProps("visitDate")}
          />

          <TextInput
            label="Адрес"
            placeholder="Москва, Крымский Вал, 9"
            styles={inputStyles}
            key={form.key("address")}
            {...form.getInputProps("address")}
          />

          <SpotButton
            size="lg"
            radius="lg"
            type="submit"
            disabled={!marker || isLoading}
            loading={isLoading}
            fullWidth
          >
            Создать метку
          </SpotButton>
        </Stack>
      </Box>
    </SpotDrawer>
  );
}
