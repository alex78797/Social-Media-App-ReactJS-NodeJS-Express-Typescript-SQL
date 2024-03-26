import { apiSlice } from "../../app/api/apiSlice";
import { IUser } from "../../types/types";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      IUser,
      {
        email: string;
        user_password: string;
        user_name: string;
        real_name: string;
      }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        data,
      }),
    }),
    loginUser: builder.mutation<
      { user: IUser; accessToken: string },
      { email: string; user_password: string }
    >({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
    }),
    logoutUser: builder.mutation<unknown, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = authApiSlice;
