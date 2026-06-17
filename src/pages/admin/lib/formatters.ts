import { typeBugReportOptions } from "@/entities/admin";

export const formatDate = (value?: string) => {
  if (!value) {
    return "Нет данных";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Нет данных";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getBugReportTypeLabel = (type: string) =>
  typeBugReportOptions.find((option) => option.value === type)?.label ?? type;
