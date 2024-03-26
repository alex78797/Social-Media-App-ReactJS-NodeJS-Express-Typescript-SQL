import { apiSlice } from "../../app/api/apiSlice";

export const uploadFileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<string, FormData>({
      query: (data) => ({
        url: "/upload",
        method: "POST",
        data,
      }),
      invalidatesTags: ["uploads"],
    }),
  }),
});

export const { useUploadFileMutation } = uploadFileApiSlice;
