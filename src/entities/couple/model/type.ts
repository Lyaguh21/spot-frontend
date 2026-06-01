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
  description: string;
  generatedName: string;
  members: ICoupleMember[];
}
