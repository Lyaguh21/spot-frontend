import { Button, Modal, Text } from "@mantine/core";
import SpotButton from "@/shared/ui/SpotButton/SpotButton";
import styles from "./SpotConfirmActionModal.module.css";

type SpotConfirmActionModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  question: string;
  confirmText: string;
  cancelText?: string;
  title?: string;
  confirmLoading?: boolean;
};

export default function SpotConfirmActionModal({
  opened,
  onClose,
  onConfirm,
  question,
  confirmText,
  cancelText = "Отмена",
  title = "Подтвердите действие",
  confirmLoading,
}: SpotConfirmActionModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      overlayProps={{ blur: 6, opacity: 0.65, color: "#040b1a" }}
      classNames={{ content: styles.content, body: styles.body }}
      radius="xl"
      size="sm"
    >
      <div className={styles.header}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.question}>{question}</Text>
      </div>
      <div className={styles.actions}>
        <SpotButton
          radius="lg"
          size="md"
          fullWidth
          onClick={onConfirm}
          loading={confirmLoading}
        >
          {confirmText}
        </SpotButton>
        <Button
          classNames={{ root: styles.cancel }}
          radius="lg"
          size="md"
          fullWidth
          onClick={onClose}
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
}
