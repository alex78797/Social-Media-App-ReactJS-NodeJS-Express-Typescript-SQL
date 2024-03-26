import axios, { AxiosError } from "axios";
import { IUser } from "../../types/types";
import {
  removeCredentials,
  setCredentials,
} from "../../features/auth/authSlice";
import { apiSlice } from "./apiSlice";
import { Mutex } from "async-mutex";

// need to inject the store because it is used in non component files

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// create a new mutex
const mutex = new Mutex();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    // Wait until the mutex is available without locking it <---> wait with this request if a reauth is going on
    await mutex.waitForUnlock();
    // Mutex is not locked, a reauth took place, user is probably authenticated again, run request with the new access token
    // (the new access token is valid --> request should not return 403 error)
    const authState = store.getState().auth;
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // When using this BACKEND_SERVER, 403 status code means access token is not valid
    // Assume access token expired --> refresh it
    if (error.config && error.response && error.response.status === 403) {
      // Check whether the mutex is locked.
      // (Requests which check this condition did not waitForUnlock() in the request interceptor)
      if (!mutex.isLocked()) {
        // Calling acquire will return a promise that resolves once the mutex becomes available.
        // The value of the resolved promise is a function that can be called to release the mutex once the task has completed.
        const release = await mutex.acquire();
        try {
          const newResponse = await axios.get<{
            user: IUser;
            newAccessToken: string;
          }>("http://localhost:3000/api/auth/refresh", {
            withCredentials: true,
          });
          if (newResponse.data) {
            // Get new access token
            const newAccessToken = newResponse.data.newAccessToken;
            const user = newResponse.data.user;

            // send the user and the new access token to the global state
            store.dispatch(
              setCredentials({
                user: user,
                accessToken: newAccessToken,
              })
            );
            // Update the request headers with the new access token
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return axiosInstance(error.config);
          } else {
            // Assume Refresh Token expired --> log user out, clear all previous state
            await axios.post("http://localhost:3000/api/auth/logout", {
              withCredentials: true,
            });
            store.dispatch(removeCredentials());
            store.dispatch(apiSlice.util.resetApiState());
          }
        } finally {
          // release must be called once the mutex should be released again
          release();
        }
      } else {
        // wait until the mutex is available without locking it
        await mutex.waitForUnlock();
        // mutex is unlocked, a reauth took place, user is probably authenticated again ---> retry original request
        const authState = store.getState().auth;
        // Update the request headers with the new access token
        error.config.headers.Authorization = `Bearer ${authState.accessToken}`;
        // Retry the original request
        return axiosInstance(error.config);
      }
    }
    // Return a Promise rejection if the status code is not 403
    return Promise.reject(error);
  }
);
