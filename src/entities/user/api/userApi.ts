import { baseApi } from "@/shared/api";
import {
  IUpdateProfileRequest,
  IUserProfileResponse,
  IUserState,
} from "../model/type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<IUserProfileResponse, void>({
      query: () => "/users/me",
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),

    updateProfile: build.mutation<IUserState, IUpdateProfileRequest>({
      query: (data) => ({
        url: "/users/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    getUserByUsername: build.query<IUserState, { username: string }>({
      query: ({ username }) => `/users/${username}`,
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),

    getUserById: build.query<IUserState, { id: number }>({
      query: ({ id }) => `/users/${id}`,
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),

    getVisitsByUsername: build.query<IUserState, { username: string }>({
      query: ({ username }) => `/users/${username}/visits`,
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetUserByUsernameQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useGetVisitsByUsernameQuery,
} = userApi;
