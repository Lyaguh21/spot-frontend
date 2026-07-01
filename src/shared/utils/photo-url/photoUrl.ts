export type PhotoUrlReference = {
  url?: string;
  signedUrl?: string;
};

export type PhotoUrlEntry = {
  src: string;
  url: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

export const toPhotoUrlEntries = (value: unknown): PhotoUrlEntry[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toPhotoUrlEntries);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return [];
    }

    if (trimmedValue.startsWith("{") || trimmedValue.startsWith("[")) {
      try {
        return toPhotoUrlEntries(JSON.parse(trimmedValue) as unknown);
      } catch {
        return [{ src: trimmedValue, url: trimmedValue }];
      }
    }

    return [{ src: trimmedValue, url: trimmedValue }];
  }

  if (!isObject(value)) {
    return [];
  }

  if ("data" in value) {
    return toPhotoUrlEntries(value.data);
  }

  const url = typeof value.url === "string" ? value.url.trim() : "";
  const signedUrl =
    typeof value.signedUrl === "string" ? value.signedUrl.trim() : "";
  const persistentUrl = url || signedUrl;
  const displayUrl = signedUrl || url;

  return persistentUrl && displayUrl
    ? [
        {
          src: displayUrl,
          url: persistentUrl,
        },
      ]
    : [];
};

export const toPhotoDisplayUrl = (value: unknown): string =>
  toPhotoUrlEntries(value)[0]?.src ?? "";
