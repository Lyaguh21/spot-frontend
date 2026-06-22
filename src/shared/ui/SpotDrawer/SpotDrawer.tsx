import { IconX } from "@tabler/icons-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SpotDrawer.module.css";
import SpotActionIcon from "../SpotActionIcon/SpotActionIcon";

type SpotDrawerProps = {
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: string | number;
  closeOnSwipeDown?: boolean;
  topRowChildren?: React.ReactNode;
};

const TRANSITION_DURATION = 420;
const MIN_CLOSE_DISTANCE = 90;
const CLOSE_VELOCITY = 0.65;

export default function SpotDrawer({
  opened,
  onClose,
  children,
  title,
  size = "80%",
  closeOnSwipeDown = true,
  topRowChildren,
}: SpotDrawerProps) {
  const [mounted, setMounted] = useState(opened);
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dragStartRef = useRef({ y: 0, time: 0 });
  const lastMoveRef = useRef({ y: 0, time: 0 });
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const maxHeight = typeof size === "number" ? `${size}px` : size;

  useEffect(() => {
    if (opened) {
      setMounted(true);
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => {
      setMounted(false);
      setDragY(0);
      setDragging(false);
    }, TRANSITION_DURATION);

    return () => window.clearTimeout(timeout);
  }, [opened]);

  useLayoutEffect(() => {
    if (!mounted || !opened) {
      return;
    }

    setVisible(false);

    // Commit the closed position before adding the visible class. Without this
    // style flush, a newly mounted portal can skip its opening transition.
    sheetRef.current?.getBoundingClientRect();
    const frame = requestAnimationFrame(() => setVisible(true));

    return () => cancelAnimationFrame(frame);
  }, [mounted, opened]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key !== "Tab" || !sheetRef.current) {
        return;
      }

      const focusableElements = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [mounted, onClose]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !closeOnSwipeDown ||
      !event.isPrimary ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest("button")
    ) {
      return;
    }

    const point = { y: event.clientY, time: performance.now() };
    dragStartRef.current = point;
    lastMoveRef.current = point;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) {
      return;
    }

    const nextDragY = Math.max(0, event.clientY - dragStartRef.current.y);
    setDragY(nextDragY);
    lastMoveRef.current = { y: event.clientY, time: performance.now() };
  };

  const finishDrag = (clientY: number) => {
    if (!dragging) {
      return;
    }

    const now = performance.now();
    const elapsed = Math.max(1, now - lastMoveRef.current.time);
    const velocity = Math.max(0, clientY - lastMoveRef.current.y) / elapsed;
    const sheetHeight = sheetRef.current?.getBoundingClientRect().height ?? 0;
    const closeDistance = Math.max(
      MIN_CLOSE_DISTANCE,
      Math.min(180, sheetHeight * 0.22),
    );

    setDragging(false);

    if (dragY >= closeDistance || velocity >= CLOSE_VELOCITY) {
      onClose();
      return;
    }

    setDragY(0);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(event.clientY);
  };

  const handlePointerCancel = () => {
    setDragging(false);
    setDragY(0);
  };

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={`${styles.root} ${visible ? styles.rootVisible : ""}`}
      aria-hidden={!visible}
    >
      <div className={styles.overlay} onClick={onClose} />
      <div
        ref={sheetRef}
        className={`${styles.sheet} ${dragging ? styles.dragging : ""}`}
        style={
          {
            "--spot-drawer-max-height": maxHeight,
            "--spot-drawer-drag-y": `${dragY}px`,
          } as React.CSSProperties
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Окно"}
      >
        <div
          className={styles.dragArea}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div className={styles.handle} />
          <div className={styles.topRow}>
            {title ? (
              <h2 className={styles.title} id={titleId}>
                {title}
              </h2>
            ) : (
              <>{topRowChildren}</>
            )}
            <div className={styles.topRowActions}>
              <SpotActionIcon
                ref={closeButtonRef}
                size={32}
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <IconX size={18} stroke={2} />
              </SpotActionIcon>
            </div>
          </div>
        </div>
        <div className={styles.scroll}>
          <div className={styles.scrollContent}>{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
