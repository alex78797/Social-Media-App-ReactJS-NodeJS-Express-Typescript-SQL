import { apiSlice } from "../../app/api/apiSlice";
import { IRelationship } from "../../types/types";

export const relationshipsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRelationship: builder.query<IRelationship, string>({
      query: (followed_user_id) => ({
        url: "/relationships?followedUserId=" + followed_user_id,
        method: "GET",
      }),
      providesTags: () => ["relationships"],
    }),
    getAllFollowedUsers: builder.query<IRelationship[], void>({
      query: () => ({ url: "/relationships/all", method: "GET" }),
      providesTags: ["relationships"],
    }),

    createAndDeleteRelationship: builder.mutation<void, string>({
      query: (user_id) => ({
        url: "/relationships?userId=" + user_id,
        method: "POST",
      }),
      invalidatesTags: ["relationships", "posts"],
    }),
  }),
});

export const {
  useGetRelationshipQuery,
  useGetAllFollowedUsersQuery,
  useCreateAndDeleteRelationshipMutation,
} = relationshipsApiSlice;
