import { ICoupleState } from "@/entities/couple";

export type UserVisibility = "PUBLIC" | "PRIVATE";

export interface IUserState {
  id: number;
  name: string;
  role: "USER" | "ADMIN";
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  visibility: UserVisibility;
  createdAt: string;
  coupleId: number | null;
  partner: Pick<IUserState, "avatarUrl" | "name" | "username"> | null;
  stats: {
    places: number;
    followers: number;
    following: number;
  };
  isFollowing?: boolean;
}

export interface IUserProfileResponse extends IUserState {}

export interface IUpdateProfileRequest extends Partial<
  Pick<IUserState, "name" | "avatarUrl" | "bio" | "visibility">
> {}

export interface IFollowersResponse {
  items: IUserState[];
  total: number;
  page: number;
  limit: number;
}

export type IFollowingItem =
  | (IUserState & { type: "USER" })
  | (ICoupleState & { type: "COUPLE" });

export interface IFollowingResponse {
  items: IFollowingItem[];
  total: number;
  page: number;
  limit: number;
}
