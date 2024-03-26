import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { IUser } from "../types/types";
import { removeCredentials, setCredentials } from "../features/auth/authSlice";
import { apiSlice } from "../app/api/apiSlice";
import Loading from "../components/Loading";

/**
 *
 * @returns Component to persist login state after page refresh. Component is used in App.tsx
 */
function PersistLogin() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  // needed with react 18 (useEffect runs twice in dev mode)
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      /**
       * When the component mounts (/loads), make a request to receive a new access token and the current user.
       * (If the refresh token is not expired), dispatch the new access token and the user to the global state.
       * Otherwise log user out.
       */
      async function verifyRefreshToken() {
        try {
          const response = await axios.get<{
            user: IUser;
            newAccessToken: string;
          }>("http://localhost:3000/api/auth/refresh", {
            withCredentials: true,
          });
          if (
            response.data &&
            response.data.user &&
            response.data.newAccessToken
          ) {
            dispatch(
              setCredentials({
                user: response.data.user,
                accessToken: response.data.newAccessToken,
              })
            );
          } else {
            // ASSUME REFRESH TOKEN EXPIRED AND LOG USER OUT
            await axios.post("http://localhost:3000/api/logout", {
              withCredentials: true,
            });
            dispatch(removeCredentials());
            dispatch(apiSlice.util.resetApiState());
          }
        } catch (err) {
          // ASSUME REFRESH TOKEN EXPIRED AND LOG USER OUT
          await axios.post("http://localhost:3000/api/logout", {
            withCredentials: true,
          });
          dispatch(removeCredentials());
          dispatch(apiSlice.util.resetApiState());
        } finally {
          setIsLoading(false);
        }
      }

      // if we do not have access token, we use the verifyRefreshToken() function above to persist login
      !accessToken ? verifyRefreshToken() : setIsLoading(false);

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  // For Components which do not fetch / get data from the server (show loading spinner until component is displayed again)
  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;

  // return !isLoading && <Outlet />;
}

export default PersistLogin;
