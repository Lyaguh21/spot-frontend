import { SpotDrawer } from "@/shared/ui";

export default function EditProfileDrawer({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  return (
    <SpotDrawer opened={opened} onClose={onClose}>
      <div>Редактирование профиля</div>
    </SpotDrawer>
  );
}
