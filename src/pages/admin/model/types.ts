import type { IUserStatisticsResponse } from "@/entities/admin";

export type DirectoryView = "users" | "couples";

export type UserIdentityData = Pick<
  IUserStatisticsResponse,
  "username" | "name" | "avatarUrl" | "id"
>;
