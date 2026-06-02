import { createSlice } from "@reduxjs/toolkit";

export interface IViewSliceState {
  ui: {
    mapIsFullScreen: boolean;
  };
}

const initialState: IViewSliceState = {
  ui: {
    mapIsFullScreen: false,
  },
};

export const userSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setMapIsFullScreen: (state, action) => {
      state.ui.mapIsFullScreen = action.payload;
    },
  },
});

export const { setMapIsFullScreen } = userSlice.actions;
export const viewReducer = userSlice.reducer;
