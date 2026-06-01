import { baseApi } from "@/shared/api";

export const coupleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export const {
  useGetCoupleCodeQuery,
  useResetCoupleCodeMutation,
  useJoinCoupleMutation,
} = coupleApi;
