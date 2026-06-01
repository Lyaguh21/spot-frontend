export {
  useGetCoupleByIdQuery,
  useFollowCoupleMutation,
  useUnfollowCoupleMutation,
  useGetCoupleCodeQuery,
  useResetCoupleCodeMutation,
  useJoinCoupleMutation,
  useUpdateCoupleMutation,
  useLeaveCoupleMutation,
} from "./api/coupleApi";

export type { ICoupleMember, ICoupleState } from "./model/type";
