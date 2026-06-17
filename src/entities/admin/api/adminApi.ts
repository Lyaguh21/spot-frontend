import { baseApi } from "@/shared/api";
import { ICreateBugReportRequest } from "../model/type";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBugReport: build.mutation<void, ICreateBugReportRequest>({
      query: (data) => ({
        url: "/users/bug-reports",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Admin", id: "LIST" }],
    }),
  }),
});

export const { useCreateBugReportMutation } = adminApi;
