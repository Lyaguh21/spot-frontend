import { baseApi } from "@/shared/api";

export type UploadImgRequest =
  | File
  | File[]
  | {
      files: File | File[];
      fieldName?: string;
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
    uploadImg: build.mutation<string | string[], UploadImgRequest>({
      query: (files) => ({
        url: "/storage/upload",
        method: "POST",
        body: buildUploadFormData(files),
        responseHandler: "text",
      }),
    }),
  }),
});

export const { useUploadImgMutation } = imgApi;
