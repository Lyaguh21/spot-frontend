import { IUserState } from "@/entities/user";

export interface ILoginRequest extends Pick<IUserState, "email"> {
  password: string;
}

export interface IRegisterRequest extends Pick<
  IUserState,
  "email" | "name" | "username"
> {
  password: string;
}

interface UserStatus {
  id: number;
  email: string;
}

export interface IStatusResponse {
  authenticated: boolean;
  user: UserStatus;
}
