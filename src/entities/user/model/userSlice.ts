import { createSlice } from "@reduxjs/toolkit";
import { IUserState } from "./type";

interface IUserSliceState extends Partial<
  Pick<IUserState, "id" | "name" | "email" | "username" | "coupleId">
> {}

const initialState: IUserSliceState = {
  id: undefined,
  name: undefined,
  username: undefined,
  email: undefined,
  coupleId: null,
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
      state.coupleId = action.payload.coupleId;
    },

    userLogout: (state) => {
      state.id = undefined;
      state.name = undefined;
      state.email = undefined;
      state.username = undefined;
      state.coupleId = null;
    },
  },
});

export const { setUser, userLogout } = userSlice.actions;
export const userReducer = userSlice.reducer;
