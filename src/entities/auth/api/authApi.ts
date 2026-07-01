import { baseApi } from "@/shared/api";
import {
  IConfirmEmailRequest,
  IConfirmEmailResponse,
  ILoginRequest,
  IRegisterRequest,
  IStatusResponse,
} from "../model/type";
import { IUserState } from "@/entities/user";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<{ user: IUserState }, IRegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
          username: data.username,
        },
      }),
      invalidatesTags: [{ type: "User" }],
    }),

    login: build.mutation<{ user: IUserState }, ILoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User" }],
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "User" },
        { type: "Couple" },
        { type: "Feed" },
        { type: "Admin" },
      ],
    }),

    status: build.query<IStatusResponse, void>({
      query: () => ({
        url: "/auth/status",
        cache: "no-store",
      }),
      providesTags: [{ type: "User" }],
    }),

    confirmEmail: build.mutation<IConfirmEmailResponse, IConfirmEmailRequest>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User" }],
    }),

    resendEmailCode: build.mutation<void, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-email-code",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User" }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useStatusQuery,
  useConfirmEmailMutation,
  useResendEmailCodeMutation,
} = authApi;
