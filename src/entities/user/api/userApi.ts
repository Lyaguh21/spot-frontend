import { baseApi } from "@/shared/api";
import {
  IFollowersResponse,
  IFollowingResponse,
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

    searchUsers: build.query<
      { items: IUserState[] },
      { search: string; page?: number; limit?: number }
    >({
      query: ({ search, page = 1, limit = 5 }) => ({
        url: "/users/search",
        params: { search, page, limit },
      }),
    }),

    getUserByUsername: build.query<IUserState, { username: string }>({
      query: ({ username }) => `/users/${username}`,
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),

    getUserById: build.query<IUserState, { id: number }>({
      query: ({ id }) => `/users/${id}`,
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),

    followToUser: build.mutation<void, { username: string }>({
      query: ({ username }) => ({
        url: `/users/${username}/follow`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    unfollowUser: build.mutation<void, { username: string }>({
      query: ({ username }) => ({
        url: `/users/${username}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),

    // Подписчики
    getFollowers: build.query<
      IFollowersResponse,
      { username: string; page?: number; limit?: number; search?: string }
    >({
      query: ({ username, page = 1, limit = 20, search }) => ({
        url: `/users/${username}/followers`,
        params: { page, limit, ...(search ? { search } : {}) },
      }),
      providesTags: [{ type: "User", id: "FOLLOWERS" }],
    }),

    // Подписки
    getFollowings: build.query<
      IFollowingResponse,
      { username: string; page?: number; limit?: number; search?: string }
    >({
      query: ({ username, page = 1, limit = 20, search }) => ({
        url: `/users/${username}/following`,
        params: { page, limit, ...(search ? { search } : {}) },
      }),
      providesTags: [{ type: "User", id: "FOLLOWING" }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetUserByUsernameQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useFollowToUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useSearchUsersQuery,
} = userApi;
