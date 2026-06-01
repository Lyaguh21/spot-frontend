import { ICoupleState } from "@/entities/couple";

export interface IUserState {
  id: number;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: string;
  coupleId: number | null;
  partner: Pick<IUserState, "avatarUrl" | "name" | "username"> | null;
  stats: {
    places: number;
    followers: number;
    following: number;
  };
}

export interface IUserProfileResponse extends IUserState {}

export interface IUpdateProfileRequest extends Partial<
  Pick<IUserState, "name" | "avatarUrl" | "bio" | "visibility">
> {}

export type IFollowersResponse = IUserState[];

export interface IFollowingResponse {
  users: IUserState[];
  couples: ICoupleState[];
}
