import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/types";

export interface InitialAuthState {
  user: IUser | null;
  accessToken: string | null;
}

const initialState: InitialAuthState = {
  user: null,
  accessToken: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, accessToken },
      }: PayloadAction<{ user: IUser; accessToken: string }>
    ) => {
      state.user = user;
      state.accessToken = accessToken;
    },
    removeCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    updateUserProperties: (
      state,
      action: PayloadAction<{
        user_name: string;
        website: string;
        city: string;
        cover_picture: string;
        profile_picture: string;
      }>
    ) => {
      state.user!.user_name = action.payload.user_name;
      state.user!.website = action.payload.website;
      state.user!.city = action.payload.city;
    },
  },
});

export const { setCredentials, removeCredentials, updateUserProperties } =
  slice.actions;

export default slice.reducer;

