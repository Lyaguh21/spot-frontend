import { baseApi } from "@/shared/api";
import { toPhotoUrlEntries } from "@/shared/utils";
import type { PhotoUrlReference } from "@/shared/utils";

export type UploadImgRequest =
  | File
  | File[]
  | {
      files: File | File[];
      fieldName?: string;
    };

type UploadImgResponse =
  | string
  | string[]
  | {
      data: unknown;
    }
  | PhotoUrlReference
  | PhotoUrlReference[];

const isWrappedUploadResponse = (
  response: unknown,
): response is { data: unknown } =>
  Boolean(
    response &&
      typeof response === "object" &&
      !Array.isArray(response) &&
      "data" in response,
  );

type UploadImgResult = string | PhotoUrlReference | (string | PhotoUrlReference)[];

const getUploadUrl = (value: unknown): UploadImgResult => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => getUploadUrl(item));
  }

  if (isWrappedUploadResponse(value)) {
    return getUploadUrl(value.data);
  }

  if (value && typeof value === "object") {
    const file = value as { url?: unknown; signedUrl?: unknown };
    const entries = toPhotoUrlEntries(file);

    if (entries.length) {
      return {
        url: entries[0].url,
        signedUrl: entries[0].src,
      };
    }
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue.startsWith("{") || trimmedValue.startsWith("[")) {
      try {
        return getUploadUrl(JSON.parse(trimmedValue) as unknown);
      } catch {
        return value;
      }
    }

    return value;
  }

  return "";
};

const buildUploadFormData = (request: UploadImgRequest) => {
  const formData = new FormData();
  const files =
    request instanceof File || Array.isArray(request) ? request : request.files;
  const fieldName =
    request instanceof File || Array.isArray(request)
      ? "file"
      : request.fieldName ?? "file";
  const filesList = Array.isArray(files) ? files : [files];

  filesList.forEach((file) => {
    formData.append(fieldName, file);
  });

  return formData;
};

const imgApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadImg: build.mutation<UploadImgResult, UploadImgRequest>({
      query: (files) => ({
        url: "/storage/upload",
        method: "POST",
        body: buildUploadFormData(files),
      }),
      transformResponse: (response: UploadImgResponse) => getUploadUrl(response),
    }),
  }),
});

export const { useUploadImgMutation } = imgApi;
