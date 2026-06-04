import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MapCreateMode = "my" | "couple" | "friends";

export interface IViewSliceState {
  ui: {
    mapIsFullScreen: boolean;
  };
  map: {
    createMode: MapCreateMode;
  };
}

const initialState: IViewSliceState = {
  ui: {
    mapIsFullScreen: false,
  },
  map: {
    createMode: "my",
  },
};

export const userSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setMapIsFullScreen: (state, action: PayloadAction<boolean>) => {
      state.ui.mapIsFullScreen = action.payload;
    },
    setMapCreateMode: (state, action: PayloadAction<MapCreateMode>) => {
      state.map.createMode = action.payload;
    },
  },
});

export const { setMapCreateMode, setMapIsFullScreen } = userSlice.actions;
export const viewReducer = userSlice.reducer;
