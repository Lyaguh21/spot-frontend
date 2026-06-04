export { userLogout, setUser, userReducer, userSlice } from "./model/userSlice";
export {
  useGetProfileQuery,
  useGetUserByUsernameQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useFollowToUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "./api/userApi";
export type {
  IUserState,
  IFollowersResponse,
  IFollowingItem,
  IFollowingResponse,
} from "./model/type";
