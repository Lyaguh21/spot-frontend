export type OnboardingStepId = "welcome" | "places" | "partner" | "friends";

export interface OnboardingStepContent {
  id: OnboardingStepId;
  title: string;
  description: string;
}

export const onboardingSteps: OnboardingStepContent[] = [
  {
    id: "welcome",
    title: "Сохраняйте любимые места и лучшие моменты",
    description:
      "Отмечайте любимые места на карте, добавляйте заметки и сохраняйте воспоминания",
  },
  {
    id: "places",
    title: "Делитесь впечатлениями",
    description:
      "Делитесь своими любимыми местами и находите новые по рекомендациям друзей",
  },
  {
    id: "partner",
    title: "Создайте общую карту с близким человеком",
    description:
      "Объединяйтесь в пару, отмечайте совместные места и храните вашу общую историю.",
  },
  {
    id: "friends",
    title: "Открывайте новые места вместе с друзьями",
    description:
      "Следите за друзьями, вдохновляйтесь их историями и находите идеи для новых встреч.",
  },
];
