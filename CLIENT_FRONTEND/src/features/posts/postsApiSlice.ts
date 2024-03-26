import { apiSlice } from "../../app/api/apiSlice";
import { IPost } from "../../types/types";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query<IPost[], string>({
      query: (user_id) => ({ url: "/posts?userId=" + user_id, method: "GET" }),
      providesTags: ["posts"],
    }),
    addPost: builder.mutation<void, { post_description: string; img: string }>({
      query: (data) => ({
        url: "/posts",
        method: "POST",
        data,
      }),
      invalidatesTags: ["posts"],
    }),
    updatePost: builder.mutation<IPost, IPost>({
      query: (data) => ({
        url: "/posts",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["posts"],
    }),
    deletePost: builder.mutation<IPost, string>({
      query: (postId) => ({
        url: "/posts/" + postId,
        method: "DELETE",
        postId,
      }),
      invalidatesTags: ["posts"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApiSlice;
