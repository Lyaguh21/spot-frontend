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
    borderColor: "rgba(109, 238, 204, 0.17)",
  },
  error: {
    borderColor: "rgba(225, 169, 169, 0.17)",
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
  const { borderColor } = typeStyles[type];

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
      style={{ borderColor }}
    >
      {message}
    </Notification>
  );
}
