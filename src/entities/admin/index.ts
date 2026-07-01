export { typeBugReportOptions } from "./model/type";
export type {
  ICouplesStatisticsResponse,
  IListBugReportResponse,
  IStatisticsResponse,
  IUserStatisticsResponse,
} from "./model/type";
export {
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
} from "./api/adminApi";
