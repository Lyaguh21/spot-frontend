export { userLogout, setUser, userReducer, userSlice } from "./model/userSlice";
export {
  useGetProfileQuery,
  useGetUserByUsernameQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useGetVisitsByUsernameQuery,
} from "./api/userApi";
export type { IUserState } from "./model/type";
