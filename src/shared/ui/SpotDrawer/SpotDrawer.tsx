import { CloseButton, Drawer, Text } from "@mantine/core";
import { useRef } from "react";
import styles from "./SpotDrawer.module.css";

type SpotDrawerProps = {
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: string | number;
  closeOnSwipeDown?: boolean;
};

export default function SpotDrawer({
  opened,
  onClose,
  children,
  title,
  size = "80%",
  closeOnSwipeDown = true,
}: SpotDrawerProps) {
  const startYRef = useRef<number | null>(null);
  const closeThreshold = 90;
  const maxHeight = typeof size === "number" ? `${size}px` : size;

  const beginDrag = (clientY: number | undefined) => {
    if (clientY === undefined) {
      return;
    }

    startYRef.current = clientY;
  };

  const updateDrag = (clientY: number | undefined) => {
    if (startYRef.current === null || clientY === undefined) {
      return;
    }

    const delta = clientY - startYRef.current;
    if (delta > closeThreshold) {
      startYRef.current = null;
      onClose();
    }
  };

  const endDrag = () => {
    startYRef.current = null;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!closeOnSwipeDown) {
      return;
    }

    beginDrag(event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updateDrag(event.clientY);
  };

  const handlePointerUp = () => {
    endDrag();
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!closeOnSwipeDown) {
      return;
    }

    beginDrag(event.touches[0]?.clientY);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    updateDrag(event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      radius="lg"
      size="auto"
      transitionProps={{ transition: "slide-up", duration: 520 }}
      overlayProps={{ blur: 6, opacity: 0.65, color: "#040b1a" }}
      classNames={{ content: styles.content, body: styles.body }}
      styles={{
        content: {
          maxHeight,
          height: "auto",
        },
      }}
    >
      <div
        className={styles.dragArea}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handle} />
        <div className={styles.topRow}>
          {title ? <Text className={styles.title}>{title}</Text> : <span />}
          <CloseButton
            tabIndex={-1}
            className={styles.close}
            onClick={onClose}
          />
        </div>
      </div>
      <div className={styles.scroll}>{children}</div>
    </Drawer>
  );
}
