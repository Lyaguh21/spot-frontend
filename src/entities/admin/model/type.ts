import { IUserState } from "@/entities/user";

export const typeBugReportOptions = [
  {
    value: "bug",
    label: "Ошибка",
    color: "red",
  },
  {
    value: "performance",
    label: "Производительность",
    color: "yellow",
  },
  {
    value: "visual",
    label: "Визуальная ошибка",
    color: "orange",
  },
  {
    value: "security",
    label: "Безопасность",
    color: "red",
  },
  {
    value: "account",
    label: "Аккаунт",
    color: "blue",
  },
  {
    value: "idea",
    label: "Идея",
    color: "green",
  },
];

export interface IBugReport {
  id: string;
  userId: string;
  user: Pick<IUserState, "id" | "username" | "name" | "avatarUrl">;
  createdAt: string;
  title: string;
  description: string;
  type: string;
  photos?: string[];
}

export interface IStatisticsResponse {
  users: number;
  couples: number;
  places: number;
}

export interface IUserStatisticsResponse extends Pick<
  IUserState,
  "id" | "username" | "email" | "name" | "avatarUrl"
> {
  createdAt: string;
  places: number;
}

export interface ICouplesStatisticsResponse {
  id: string;
  createdAt: string;
  places: number;
  members: Pick<IUserState, "id" | "username" | "name" | "avatarUrl">[];
}

export interface ICreateBugReportRequest extends Pick<
  IBugReport,
  "title" | "description" | "type" | "photos"
> {}

export interface IListBugReportResponse extends IBugReport {}
