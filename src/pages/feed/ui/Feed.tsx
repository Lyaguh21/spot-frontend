import { useNotifications } from "@/shared/lib";
import { ActionIcon } from "@mantine/core";

export default function FeedPage() {
  const { showSuccess, showError } = useNotifications();
  return (
    <div>
      <ActionIcon onClick={() => showSuccess("This is a success message!")}>
        Show Success
      </ActionIcon>
      <ActionIcon onClick={() => showError("This is an error message!")}>
        Show Error
      </ActionIcon>
    </div>
  );
}
