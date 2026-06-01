export {
  useGetCoupleByIdQuery,
  useFollowCoupleMutation,
  useUnfollowCoupleMutation,
  useGetCoupleCodeQuery,
  useResetCoupleCodeMutation,
  useJoinCoupleMutation,
} from "./api/coupleApi";

export type { ICoupleMember, ICoupleState } from "./model/type";
