import { Box, Center, Image, Text } from "@mantine/core";
import { Lightbox } from "@mantine-bites/lightbox";
import { toPhotoUrlEntries } from "@/shared/utils";
import { IconPhoto } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./SpotPhotoViewer.module.css";

type SpotPhotoViewerProps = {
  photos: unknown[];
  alt?: string;
  className?: string;
};

export default function SpotPhotoViewer({
  photos,
  alt = "Фото",
  className,
}: SpotPhotoViewerProps) {
  const [opened, setOpened] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const photoEntries = toPhotoUrlEntries(photos);
  const visiblePhotos = photoEntries.slice(0, 3);
  const hiddenCount = Math.max(0, photoEntries.length - visiblePhotos.length);
  const layoutVariant =
    photoEntries.length === 1
      ? "single"
      : photoEntries.length === 2
        ? "double"
        : "triple";

  const open = (index: number) => {
    setInitialSlide(index);
    setOpened(true);
  };

  if (!photoEntries.length) {
    return null;
  }

  return (
    <>
      <Box
        className={[styles.root, className].filter(Boolean).join(" ")}
        data-layout={layoutVariant}
      >
        {visiblePhotos.map(({ src, url }, index) => {
          const isLastVisible = index === visiblePhotos.length - 1;
          const position =
            index === 0 ? "hero" : index === 1 ? "top" : "bottom";

          return (
            <Box
              component="button"
              key={`${url}-${index}`}
              type="button"
              className={styles.photoButton}
              data-position={position}
              data-with-overlay={
                hiddenCount > 0 && isLastVisible ? true : undefined
              }
              onClick={() => open(index)}
              aria-label={`Открыть фото ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} ${index + 1}`}
                className={styles.photo}
                fit="cover"
              />

              {hiddenCount > 0 && isLastVisible && (
                <Center className={styles.overlay} aria-hidden="true">
                  <Text component="span" className={styles.overlayCount}>
                    +{hiddenCount}
                  </Text>
                  <IconPhoto
                    className={styles.overlayIcon}
                    size={30}
                    stroke={1.8}
                  />
                </Center>
              )}
            </Box>
          );
        })}
      </Box>

      <Lightbox
        images={photoEntries.map(({ src }) => ({ src }))}
        opened={opened}
        onClose={() => setOpened(false)}
        initialSlide={initialSlide}
      />
    </>
  );
}
