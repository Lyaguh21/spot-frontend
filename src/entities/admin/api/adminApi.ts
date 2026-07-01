import { baseApi } from "@/shared/api";
import {
  ICouplesStatisticsResponse,
  ICreateBugReportRequest,
  IListBugReportResponse,
  IStatisticsResponse,
  IUserStatisticsResponse,
} from "../model/type";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminStatistics: build.query<IStatisticsResponse, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: [{ type: "Admin", id: "STATS" }],
    }),

    getUsersStatistics: build.query<IUserStatisticsResponse[], void>({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: [{ type: "Admin", id: "USERS_LIST" }],
    }),

    getCouplesStatistics: build.query<ICouplesStatisticsResponse[], void>({
      query: () => ({
        url: "/admin/couples",
        method: "GET",
      }),
      providesTags: [{ type: "Admin", id: "COUPLES_LIST" }],
    }),

    getBugReports: build.query<IListBugReportResponse[], void>({
      query: () => ({
        url: "/admin/bug-reports",
        method: "GET",
      }),
      providesTags: [{ type: "Admin", id: "BUG_REPORTS_LIST" }],
    }),

    createBugReport: build.mutation<void, ICreateBugReportRequest>({
      query: (data) => ({
        url: "/users/bug-reports",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Admin", id: "BUG_REPORTS_LIST" }],
    }),

    deleteBugReport: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/bug-reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Admin", id: "BUG_REPORTS_LIST" }],
    }),

    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Admin", id: "USERS_LIST" }],
    }),

    restoreUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Admin", id: "USERS_LIST" }],
    }),

    banUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/ban`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Admin", id: "USERS_LIST" }],
    }),

    unbanUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/unban`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Admin", id: "USERS_LIST" }],
    }),
  }),
});

export const {
  useCreateBugReportMutation,
  useGetAdminStatisticsQuery,
  useGetBugReportsQuery,
  useGetCouplesStatisticsQuery,
  useGetUsersStatisticsQuery,
  useDeleteBugReportMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} = adminApi;
