import { useUploadPhotos } from "@/entities/img";
import { toPhotoUrlEntries } from "@/shared/utils";
import {
  ActionIcon,
  Button,
  Group,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconCheck,
  IconCloudUpload,
  IconPhoto,
  IconPhotoPlus,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./SpotPhotoInput.module.css";

type BaseProps = {
  accept?: string;
  acceptHint?: string;
  addText?: string;
  chooseText?: string;
  className?: string;
  clearText?: string;
  description?: string;
  disabled?: boolean;
  doneText?: string;
  error?: React.ReactNode;
  maxSizeMb?: number;
  replaceText?: string;
  title?: string;
  uploadFieldName?: string;
  withDoneButton?: boolean;
  onDone?: () => void;
  onUploadError?: (error: unknown) => void;
};

export type SpotPhotoInputSingleProps = BaseProps & {
  multiple?: false;
  maxPhoto?: never;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
};

export type SpotPhotoInputMultipleProps = BaseProps & {
  multiple: true;
  maxPhoto?: number;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
};

type SpotPhotoInputProps =
  | SpotPhotoInputSingleProps
  | SpotPhotoInputMultipleProps;

type PhotoItem = {
  id: string;
  src: string;
  url?: string;
  name: string;
  size?: number;
  progress?: number;
  status: "uploaded" | "uploading" | "error";
  isLocal?: boolean;
  file?: File;
};

const DEFAULT_MAX_SIZE_MB = 10;

const getFileId = (file: File) =>
  `${file.name}-${file.lastModified}-${file.size}-${Math.random().toString(16).slice(2)}`;

const getFileNameFromUrl = (url: string) => {
  const cleanUrl = url.split("?")[0];
  const fileName = cleanUrl.split("/").filter(Boolean).at(-1);

  return fileName ? decodeURIComponent(fileName) : "Фото";
};

const formatFileSize = (size?: number) => {
  if (!size) {
    return "";
  }

  const megabytes = size / 1024 / 1024;

  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} МБ`;
};

const toUrlList = (value: string | string[] | null | undefined) =>
  toPhotoUrlEntries(value).map((entry) => entry.url);

const createItemsFromValue = (
  value: string | string[] | null | undefined,
  reusableItems: PhotoItem[] = [],
) =>
  toPhotoUrlEntries(value).map(({ src, url }, index) => {
    const reusableItem = reusableItems.find((item) => item.url === url);
    const shouldKeepLocalPreview = reusableItem?.isLocal && reusableItem.src;

    return {
      id: reusableItem?.id ?? `${url}-${index}`,
      isLocal: shouldKeepLocalPreview ? true : undefined,
      name: getFileNameFromUrl(url),
      src: shouldKeepLocalPreview ? reusableItem.src : src,
      status: "uploaded" as const,
      url,
    };
  });

export default function SpotPhotoInput({
  accept = "image/*",
  acceptHint,
  addText = "Добавить ещё",
  chooseText = "Выбрать фото",
  className,
  clearText = "Очистить все",
  defaultValue,
  description = "Выберите фотографии или просто перетащите их сюда",
  disabled,
  doneText = "Готово",
  error,
  maxPhoto,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
  multiple = false,
  onChange,
  onDone,
  onUploadError,
  replaceText = "Заменить фото",
  title = "Загрузить фото",
  uploadFieldName,
  value,
  withDoneButton = false,
}: SpotPhotoInputProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const localPreviewUrlsRef = useRef<string[]>([]);
  const { uploadPhotos, isLoading } = useUploadPhotos({
    fieldName: uploadFieldName,
  });
  const [items, setItems] = useState<PhotoItem[]>(
    createItemsFromValue(value ?? defaultValue),
  );
  const [dropIsActive, setDropIsActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const uploadedItems = items.filter((item) => item.status === "uploaded");
  const uploadingItems = items.filter((item) => item.status === "uploading");
  const transferItems = items.filter((item) => item.status !== "uploaded");
  const hasPhotos = items.length > 0;
  const maxPhotoLimit =
    multiple && typeof maxPhoto === "number"
      ? Math.max(0, maxPhoto)
      : undefined;
  const maxPhotoReached =
    maxPhotoLimit !== undefined && uploadedItems.length >= maxPhotoLimit;
  const isSingleUploaded = !multiple && uploadedItems.length > 0;
  const inputDisabled = disabled || isLoading || maxPhotoReached;
  const helperText =
    acceptHint ??
    `Поддерживаются JPG, PNG, WEBP. Максимальный размер — ${maxSizeMb} МБ`;

  const revokeLocalPreviews = () => {
    localPreviewUrlsRef.current.forEach((previewUrl) => {
      URL.revokeObjectURL(previewUrl);
    });
    localPreviewUrlsRef.current = [];
  };

  const revokeLocalPreview = (previewUrl: string) => {
    if (!localPreviewUrlsRef.current.includes(previewUrl)) {
      return;
    }

    URL.revokeObjectURL(previewUrl);
    localPreviewUrlsRef.current = localPreviewUrlsRef.current.filter(
      (currentPreviewUrl) => currentPreviewUrl !== previewUrl,
    );
  };

  const revokeUnusedLocalPreviews = (
    currentItems: PhotoItem[],
    nextItems: PhotoItem[],
  ) => {
    currentItems.forEach((item) => {
      if (
        item.isLocal &&
        !nextItems.some((nextItem) => nextItem.src === item.src)
      ) {
        revokeLocalPreview(item.src);
      }
    });
  };

  useEffect(() => {
    if (value !== undefined) {
      setItems((current) => {
        const nextItems = createItemsFromValue(value, current);

        revokeUnusedLocalPreviews(current, nextItems);

        return nextItems;
      });
    }
  }, [value]);

  useEffect(() => {
    if (uploadingItems.length === 0) {
      return;
    }

    const progressInterval = window.setInterval(() => {
      setItems((current) =>
        current.map((item) => {
          if (item.status !== "uploading") {
            return item;
          }

          const currentProgress = item.progress ?? 0;

          if (currentProgress >= 99) {
            return item;
          }

          const step =
            currentProgress < 70 ? 7 : currentProgress < 90 ? 3 : 1;

          return {
            ...item,
            progress: Math.min(99, currentProgress + step),
          };
        }),
      );
    }, 120);

    return () => window.clearInterval(progressInterval);
  }, [uploadingItems.length]);

  useEffect(() => () => revokeLocalPreviews(), []);

  const commitValue = (nextValue: string | string[] | null) => {
    if (multiple) {
      (onChange as SpotPhotoInputMultipleProps["onChange"])?.(
        toUrlList(nextValue),
      );
      return;
    }

    (onChange as SpotPhotoInputSingleProps["onChange"])?.(
      typeof nextValue === "string" ? nextValue : null,
    );
  };

  const openFileDialog = () => {
    if (!inputDisabled) {
      inputRef.current?.click();
    }
  };

  const clearInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const clearAll = () => {
    revokeLocalPreviews();
    clearInputValue();
    setItems([]);
    setLocalError(null);
    commitValue(multiple ? [] : null);
  };

  const removeItem = (id: string) => {
    setItems((current) => {
      const removedItem = current.find((item) => item.id === id);
      const nextItems = current.filter((item) => item.id !== id);
      const nextValue = nextItems
        .filter((item) => item.status === "uploaded" && item.url)
        .map((item) => item.url as string);

      if (removedItem?.isLocal) {
        revokeLocalPreview(removedItem.src);
      }

      commitValue(multiple ? nextValue : (nextValue[0] ?? null));

      return nextItems;
    });
  };

  const commitItemsValue = (nextItems: PhotoItem[]) => {
    const nextValue = nextItems
      .filter((item) => item.status === "uploaded" && item.url)
      .map((item) => item.url as string);

    commitValue(multiple ? nextValue : (nextValue[0] ?? null));
  };

  const validateFiles = (files: File[]) => {
    const maxSize = maxSizeMb * 1024 * 1024;
    const photoSlots =
      maxPhotoLimit === undefined
        ? undefined
        : Math.max(0, maxPhotoLimit - uploadedItems.length);
    const validFiles = files.filter((file) => {
      const isImage = accept.includes("image")
        ? file.type.startsWith("image/")
        : true;
      const fitsSize = file.size <= maxSize;

      return isImage && fitsSize;
    });

    const limitedFiles = multiple
      ? validFiles.slice(0, photoSlots ?? validFiles.length)
      : validFiles.slice(0, 1);

    if (validFiles.length !== files.length) {
      setLocalError(`Можно загрузить только изображения до ${maxSizeMb} МБ`);
    } else if (
      multiple &&
      maxPhotoLimit !== undefined &&
      limitedFiles.length !== validFiles.length
    ) {
      setLocalError(`Можно загрузить не более ${maxPhotoLimit} фото`);
    } else {
      setLocalError(null);
    }

    return limitedFiles;
  };

  const createUploadingItems = (files: File[]) =>
    files.map((file) => {
      const src = URL.createObjectURL(file);
      localPreviewUrlsRef.current.push(src);

      return {
        id: getFileId(file),
        isLocal: true,
        name: file.name,
        progress: 1,
        size: file.size,
        src,
        status: "uploading" as const,
        file,
      };
    });

  const retryItem = async (id: string) => {
    const item = items.find((currentItem) => currentItem.id === id);

    if (!item?.file) {
      return;
    }

    setLocalError(null);
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === id
          ? { ...currentItem, progress: 1, status: "uploading" as const }
          : currentItem,
      ),
    );

    try {
      const uploadedValue = await uploadPhotos(item.file);
      const uploadedEntry = toPhotoUrlEntries(uploadedValue)[0];

      setItems((current) => {
        const nextItems = current.map((currentItem) =>
          currentItem.id === id
            ? {
                ...currentItem,
                progress: undefined,
                status: "uploaded" as const,
                url: uploadedEntry?.url ?? currentItem.src,
              }
            : currentItem,
        );

        commitItemsValue(nextItems);

        return nextItems;
      });
    } catch (caughtError) {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === id
            ? { ...currentItem, status: "error" as const }
            : currentItem,
        ),
      );
      setLocalError("Не удалось загрузить фото");
      onUploadError?.(caughtError);
    } finally {
      clearInputValue();
    }
  };

  const uploadFiles = async (selectedFiles: File[]) => {
    const files = validateFiles(selectedFiles);

    if (files.length === 0) {
      clearInputValue();
      return;
    }

    if (!multiple) {
      revokeLocalPreviews();
    }

    const uploading = createUploadingItems(files);
    const baseItems = multiple ? items : [];
    const nextUploadingItems = multiple
      ? [...baseItems, ...uploading]
      : uploading;

    setItems(nextUploadingItems);

    try {
      const uploadedValue = multiple
        ? await uploadPhotos(files)
        : await uploadPhotos(files[0]);
      const uploadedEntries = toPhotoUrlEntries(uploadedValue);
      const uploaded = uploading.map((item, index) => {
        const uploadedEntry = uploadedEntries[index];

        return {
          ...item,
          isLocal: true,
          status: "uploaded" as const,
          src: item.src,
          url: uploadedEntry?.url ?? item.src,
        };
      });
      setItems((current) => {
        const nextItems = current.map((currentItem) => {
          const uploadedIndex = uploading.findIndex(
            (uploadingItem) => uploadingItem.id === currentItem.id,
          );

          return uploadedIndex === -1 ? currentItem : uploaded[uploadedIndex];
        });

        commitItemsValue(nextItems);

        return nextItems;
      });
    } catch (caughtError) {
      setItems((current) =>
        current.map((item) =>
          uploading.some((uploadingItem) => uploadingItem.id === item.id)
            ? { ...item, status: "error" as const }
            : item,
        ),
      );
      setLocalError("Не удалось загрузить фото");
      onUploadError?.(caughtError);
    } finally {
      clearInputValue();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(event.currentTarget.files ?? []));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropIsActive(false);

    if (!inputDisabled) {
      uploadFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!inputDisabled) {
      setDropIsActive(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDropIsActive(false);
    }
  };

  const renderDropzone = (mode: "empty" | "replace" | "add") => (
    <div
      className={styles.dropzone}
      data-active={dropIsActive || undefined}
      data-disabled={inputDisabled || undefined}
      onClick={openFileDialog}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      tabIndex={inputDisabled ? -1 : 0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFileDialog();
        }
      }}
    >
      {mode === "empty" && (
        <IconCloudUpload className={styles.cloudIcon} size={72} stroke={1.7} />
      )}
      {mode === "empty" && (
        <Stack gap={4} align="center">
          <Text className={styles.dropTitle}>Перетащите фото сюда</Text>
          <Text className={styles.dropSubtitle}>
            или <span>нажмите</span>, чтобы выбрать файлы
          </Text>
        </Stack>
      )}
      <Button
        className={styles.pickButton}
        disabled={inputDisabled}
        leftSection={<IconPhoto size={20} />}
        onClick={(event) => {
          event.stopPropagation();
          openFileDialog();
        }}
        type="button"
        variant="transparent"
      >
        {mode === "replace"
          ? replaceText
          : mode === "add"
            ? addText
            : chooseText}
      </Button>
    </div>
  );

  return (
    <section className={[styles.card, className].filter(Boolean).join(" ")}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={inputDisabled}
        multiple={multiple}
        className={styles.nativeInput}
        onChange={handleInputChange}
      />

      {!hasPhotos && (
        <>
          <Stack gap={6}>
            <Text className={styles.title}>{title}</Text>
            <Text className={styles.description}>{description}</Text>
          </Stack>
          {renderDropzone("empty")}
          <Text className={styles.hint}>{helperText}</Text>
        </>
      )}

      {transferItems.length > 0 && (
        <Stack gap={14}>
          <Text className={styles.title}>
            {uploadingItems.length > 0 ? "Загрузка..." : "Не удалось загрузить"}
          </Text>
          <Stack gap={12}>
            {transferItems.map((item) => (
              <Group
                key={item.id}
                className={styles.uploadRow}
                gap={14}
                wrap="nowrap"
              >
                <img
                  className={styles.uploadThumb}
                  src={item.src}
                  alt={item.name}
                />
                <Stack gap={2} className={styles.fileInfo}>
                  <Text className={styles.fileName} truncate>
                    {item.name}
                  </Text>
                  <Text className={styles.fileMeta}>
                    {formatFileSize(item.size)}
                  </Text>
                </Stack>
                <Stack gap={8} className={styles.progressCell}>
                  <Text className={styles.progressText}>
                    {item.status === "error" ? "Ошибка" : "Загрузка..."}
                  </Text>
                  <Progress
                    className={styles.progress}
                    value={item.status === "error" ? 100 : item.progress ?? 0}
                    color={item.status === "error" ? "red" : "violet"}
                    size={5}
                  />
                </Stack>
                {item.status === "error" && (
                  <Button
                    className={styles.retryButton}
                    disabled={isLoading}
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => retryItem(item.id)}
                    type="button"
                    variant="transparent"
                  >
                    Попробовать снова
                  </Button>
                )}
                <ActionIcon
                  aria-label={
                    item.status === "uploading"
                      ? "Остановить загрузку"
                      : "Удалить фото"
                  }
                  className={styles.rowAction}
                  onClick={() => removeItem(item.id)}
                  size={34}
                  variant="transparent"
                >
                  <IconX size={20} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Stack>
      )}

      {hasPhotos && uploadedItems.length > 0 && multiple && (
        <Stack gap={20}>
          <Group justify="space-between" wrap="nowrap">
            <Text className={styles.title}>
              Выбрано {uploadedItems.length} фото
            </Text>
            <button
              className={styles.linkButton}
              onClick={clearAll}
              type="button"
            >
              {clearText}
            </button>
          </Group>

          <div className={styles.previewGrid}>
            {uploadedItems.map((item) => (
              <div className={styles.preview} key={item.id}>
                <img alt={item.name} src={item.src} />
                <ActionIcon
                  aria-label="Удалить фото"
                  className={styles.remove}
                  onClick={() => removeItem(item.id)}
                  radius="xl"
                  size={34}
                  variant="filled"
                >
                  <IconX size={18} />
                </ActionIcon>
              </div>
            ))}
          </div>

          <Group className={styles.actions} justify="space-between">
            <Button
              className={styles.secondaryButton}
              disabled={inputDisabled}
              leftSection={<IconPhotoPlus size={20} />}
              onClick={openFileDialog}
              type="button"
              variant="transparent"
            >
              {addText}
            </Button>
            {withDoneButton && (
              <Button
                className={styles.doneButton}
                onClick={onDone}
                type="button"
              >
                {doneText}
              </Button>
            )}
          </Group>
        </Stack>
      )}

      {isSingleUploaded && (
        <Stack gap={18}>
          <Group justify="space-between" wrap="nowrap">
            <Text className={styles.title}>
              {title === "Загрузить фото" ? "Фото" : title}
            </Text>
            <button
              className={styles.deleteButton}
              onClick={clearAll}
              type="button"
            >
              Удалить
            </button>
          </Group>

          {uploadedItems.map((item) => (
            <Group
              key={item.id}
              className={styles.singleRow}
              gap={14}
              wrap="nowrap"
            >
              <img
                className={styles.uploadThumb}
                src={item.src}
                alt={item.name}
              />
              <Stack gap={2} className={styles.fileInfo}>
                <Text className={styles.fileName} truncate>
                  {item.name}
                </Text>
                {item.size && (
                  <Text className={styles.fileMeta}>
                    {formatFileSize(item.size)}
                  </Text>
                )}
              </Stack>
              <div className={styles.successIcon}>
                <IconCheck size={22} />
              </div>
            </Group>
          ))}

          {renderDropzone("replace")}
        </Stack>
      )}

      {(error || localError) && (
        <Text className={styles.error} role="alert">
          {error ?? localError}
        </Text>
      )}
    </section>
  );
}
