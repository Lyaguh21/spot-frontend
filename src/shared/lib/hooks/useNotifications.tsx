import { notifications } from "@mantine/notifications";
import SpotNotification from "@/shared/ui/SpotNotification/SpotNotification";

export const useNotifications = () => {
  const createId = () =>
    `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const showError = (message: string) => {
    const id = createId();
    notifications.show({
      id,
      message: (
        <SpotNotification
          type="error"
          title="Ошибка"
          message={message}
          onClose={() => notifications.hide(id)}
        />
      ),
      position: "top-center",
      autoClose: 3000,
      withCloseButton: false,
      styles: {
        root: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
        },
        body: {
          padding: 0,
        },
      },
    });
  };

  const showSuccess = (message: string) => {
    const id = createId();
    notifications.show({
      id,
      message: (
        <SpotNotification
          type="success"
          title="Успешно"
          message={message}
          onClose={() => notifications.hide(id)}
        />
      ),
      position: "top-center",
      withCloseButton: false,
      autoClose: 3000,
      styles: {
        root: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
        },
        body: {
          padding: 0,
        },
      },
    });
  };

  return { showError, showSuccess };
};
