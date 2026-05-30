import { Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import styles from "./SpotNotification.module.css";

type SpotNotificationProps = {
  type: "success" | "error";
  title: string;
  message: string;
  onClose?: () => void;
};

const typeStyles = {
  success: {
    borderColor: "rgba(56, 189, 248, 0.45)",
    glow: "0 10px 26px rgba(16, 185, 129, 0.25)",
  },
  error: {
    borderColor: "rgba(248, 113, 113, 0.45)",
    glow: "0 10px 26px rgba(248, 113, 113, 0.2)",
  },
} as const;

export default function SpotNotification({
  type,
  title,
  message,
  onClose,
}: SpotNotificationProps) {
  const icon =
    type === "success" ? <IconCheck size={18} /> : <IconX size={18} />;
  const { borderColor, glow } = typeStyles[type];

  return (
    <Notification
      classNames={{
        root: styles.root,
        title: styles.title,
        description: styles.description,
        icon: styles.icon,
      }}
      icon={icon}
      title={title}
      withCloseButton
      onClose={onClose}
      style={{ borderColor, boxShadow: glow }}
    >
      {message}
    </Notification>
  );
}
