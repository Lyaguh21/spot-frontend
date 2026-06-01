import { IUserState } from "@/entities/user";

export interface ICoupleMember {
  id: string;
  coupleId: string;
  userId: string;
  user: Pick<IUserState, "id" | "username" | "name" | "avatarUrl">;
}

export interface ICoupleState {
  status: "SUCCESS" | "NOT-COUPLE";
  id: string;
  bio: string;
  generatedName: string;
  members: ICoupleMember[];
  isPrivate: boolean;
  isFollowing: boolean;
  placesCount: number;
  followersCount: number;
}

export interface IUpdateCoupleRequest extends Partial<
  Pick<ICoupleState, "bio" | "isPrivate">
> {}
