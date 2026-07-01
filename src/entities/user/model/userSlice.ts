import { createSlice } from "@reduxjs/toolkit";
import { IUserState } from "./type";

interface IUserSliceState
  extends Partial<
    Pick<
      IUserState,
      | "id"
      | "name"
      | "email"
      | "username"
      | "avatarUrl"
      | "coupleId"
      | "partner"
      | "role"
      | "isBanned"
    >
  > {
  isEmailVerified?: boolean;
}

const initialState: IUserSliceState = {
  id: undefined,
  name: undefined,
  username: undefined,
  email: undefined,
  avatarUrl: undefined,
  role: undefined,
  coupleId: null,
  partner: null,
  isEmailVerified: undefined,
  isBanned: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.avatarUrl = action.payload.avatarUrl;
      state.coupleId = action.payload.coupleId;
      state.partner = action.payload.partner;
      state.role = action.payload.role;
      state.isEmailVerified = action.payload.isEmailVerified;
      state.isBanned = action.payload.isBanned;
    },

    confirmUserEmail: (state) => {
      state.isEmailVerified = true;
    },

    userLogout: (state) => {
      state.id = undefined;
      state.name = undefined;
      state.email = undefined;
      state.username = undefined;
      state.avatarUrl = undefined;
      state.coupleId = null;
      state.partner = null;
      state.role = undefined;
      state.isEmailVerified = undefined;
      state.isBanned = undefined;
    },
  },
});

export const { setUser, userLogout, confirmUserEmail } = userSlice.actions;
export const userReducer = userSlice.reducer;
