import { ICoupleState } from "@/entities/couple";

export interface IUserState {
  id: number;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  isPrivate: boolean;
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
  Pick<IUserState, "name" | "avatarUrl" | "bio" | "isPrivate">
> {}

export interface IFollowersResponse {
  items: IUserState[];
  total: number;
  page: number;
  limit: number;
}

export interface IFollowingResponse {
  users: IUserState[];
  couples: ICoupleState[];
}
