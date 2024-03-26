import { apiSlice } from "../../app/api/apiSlice";
import { ILike } from "../../types/types";

export const likesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLikes: builder.query<ILike[], string>({
      query: (post_id) => ({ url: "/likes?postId=" + post_id, method: "GET" }),
      providesTags: ["likes"],
    }),
    handleLikeAndUnlike: builder.mutation<
      void,
      { user_id: string; post_id: string }
    >({
      query: (data) => ({
        url: `/likes?postId=${data.post_id}&userId=${data.user_id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["likes"],
    }),
  }),
});

export const { useGetAllLikesQuery, useHandleLikeAndUnlikeMutation } =
  likesApiSlice;
