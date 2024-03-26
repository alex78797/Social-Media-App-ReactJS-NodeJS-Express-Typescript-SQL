import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";

// define a custom axios base query
const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = {
      baseUrl: "",
    }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    { status: number | undefined; data: any } // types for axios base query errors!!!
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      // use the defined axios instance
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
export const apiSlice = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["posts", "comments", "likes", "relationships", "users", "uploads"],
  // underscore `_` is added to please typescript (variable not used (?))
  endpoints: (_builder) => ({}),
});
