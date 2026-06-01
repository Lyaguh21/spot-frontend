import { baseApi } from "@/shared/api";
import { ICoupleState, IUpdateCoupleRequest } from "../model/type";

export const coupleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCoupleById: build.query<
      ICoupleState & { displayName?: string },
      { id: string }
    >({
      query: ({ id }) => `/couples/${id}`,
      providesTags: (_result, _error, arg) => [{ type: "Couple", id: arg.id }],
    }),

    followCouple: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/couples/${id}/follow`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Couple", id: arg.id },
      ],
    }),

    unfollowCouple: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/couples/${id}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Couple", id: arg.id },
      ],
    }),

    getCoupleCode: build.query<{ inviteCode: string }, void>({
      query: () => "/couples",
      providesTags: [{ type: "Couple", id: "CODE" }],
    }),

    resetCoupleCode: build.mutation<{ inviteCode: string }, void>({
      query: () => ({ url: "/couples/reset-invite-code", method: "POST" }),
      invalidatesTags: [{ type: "Couple", id: "CODE" }],
    }),

    joinCouple: build.mutation<void, { inviteCode: string }>({
      query: (data) => ({
        url: "/couples/join",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Couple", id: "MyCouple" }, { type: "User" }],
    }),

    updateCouple: build.mutation<void, { id: string } & IUpdateCoupleRequest>({
      query: ({ id, ...data }) => ({
        url: `/couples/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Couple", id: arg.id },
      ],
    }),

    leaveCouple: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/couples/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Couple", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetCoupleByIdQuery,
  useFollowCoupleMutation,
  useUnfollowCoupleMutation,
  useGetCoupleCodeQuery,
  useResetCoupleCodeMutation,
  useJoinCoupleMutation,
  useUpdateCoupleMutation,
  useLeaveCoupleMutation,
} = coupleApi;
