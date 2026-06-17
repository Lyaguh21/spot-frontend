export const typeBugReportOptions = [
  {
    value: "bug",
    label: "Ошибка в работе",
  },
  {
    value: "visual-bug",
    label: "Визуальная ошибка",
  },
  {
    value: "idea",
    label: "Идея улучшения",
  },
];

export interface ICreateBugReportRequest {
  title: string;
  description: string;
  type: string;
  photoUrl?: string;
}
