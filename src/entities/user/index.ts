export { userLogout, setUser, userReducer, userSlice } from "./model/userSlice";
export {
  useGetProfileQuery,
  useGetUserByUsernameQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useGetVisitsByUsernameQuery,
  useFollowToUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "./api/userApi";
export type {
  IUserState,
  IFollowersResponse,
  IFollowingResponse,
} from "./model/type";
