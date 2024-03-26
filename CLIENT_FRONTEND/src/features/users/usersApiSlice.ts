import { apiSlice } from "../../app/api/apiSlice";
import { IUser } from "../../types/types";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommentAuthor: builder.query<IUser, string>({
      query: (comment_id) => ({
        url: "/users/findCommentAuthor/" + comment_id,
        method: "GET",
      }),
      providesTags: () => ["users"],
    }),
    getPostAuthor: builder.query<IUser, string>({
      query: (post_id) => ({
        url: "/users/findPostAuthor/" + post_id,
        method: "GET",
      }),
      providesTags: () => ["users"],
    }),
    getUser: builder.query<IUser, string>({
      query: (user_id) => ({
        url: "/users/findUser/" + user_id,
        method: "GET",
      }),
      providesTags: () => ["users"],
    }),
    updateUser: builder.mutation<
      void,
      {
        user_name: string;
        city: string;
        website: string;
        profile_picture: string;
        cover_picture: string;
      }
    >({
      query: (data) => ({
        url: "/users",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["users"],
    }),
    resetPassword: builder.mutation<
      void,
      {
        old_password: string;
        new_password: string;
        new_password_confirm: string;
      }
    >({
      query: (data) => ({
        url: "/users/resetPassword",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation<void, { password: string }>({
      query: (data) => ({
        url: "/users/deleteAccount",
        method: "DELETE",
        data,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetCommentAuthorQuery,
  useGetPostAuthorQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useDeleteUserMutation,
} = usersApiSlice;
