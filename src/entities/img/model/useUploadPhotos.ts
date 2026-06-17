import { useCallback } from "react";
import { useUploadImgMutation } from "./imgApi";

type UseUploadPhotosOptions = {
  fieldName?: string;
};

type UploadPhotos = {
  (files: File): Promise<string>;
  (files: File[]): Promise<string[]>;
};

export const useUploadPhotos = (options?: UseUploadPhotosOptions) => {
  const [uploadImg, state] = useUploadImgMutation();
  const fieldName = options?.fieldName ?? "file";

  const uploadPhotos = useCallback(
    async (files: File | File[]) => {
      const isMultiple = Array.isArray(files);

      if (isMultiple && files.length === 0) {
        return [];
      }

      if (isMultiple) {
        const uploadedFiles = await Promise.all(
          files.map((file) => uploadImg({ files: file, fieldName }).unwrap()),
        );

        return uploadedFiles.flatMap((uploaded) =>
          Array.isArray(uploaded) ? uploaded : [uploaded],
        );
      }

      const uploaded = await uploadImg({ files, fieldName }).unwrap();
      const urls = Array.isArray(uploaded) ? uploaded : [uploaded];

      return urls[0] ?? "";
    },
    [fieldName, uploadImg],
  ) as UploadPhotos;

  return {
    uploadPhotos,
    ...state,
  };
};
