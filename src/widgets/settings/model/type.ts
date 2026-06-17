export type SettingsOption = {
  title: string;
  description: string;
  icon: React.ReactNode;
  danger?: boolean;
  adminOnly?: boolean;
  onClick: () => void;
};

