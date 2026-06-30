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

interface UserStatus extends Pick<
  IUserState,
  "id" | "name" | "username" | "email" | "coupleId" | "partner" | "role"
> {
  isEmailVerified: boolean;
}

export interface IStatusResponse {
  authenticated: boolean;
  user: UserStatus;
}

export interface IConfirmEmailRequest {
  email: string;
  code: string;
}
