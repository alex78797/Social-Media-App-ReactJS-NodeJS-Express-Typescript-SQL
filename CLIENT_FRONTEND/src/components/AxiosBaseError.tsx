import { SerializedError } from "@reduxjs/toolkit";

/**
 * Displays an error message from the server.
 * Component is used when data is added/retrieved from/to the server using the axios library.
 * @param param0
 * @returns
 */
function AxiosBaseError({
  error,
}: {
  error:
    | {
        status: number | undefined;
        data: any;
      }
    | SerializedError
    | undefined;
}) {
  // @ts-ignore
  return <p style={{ color: "red" }}>{error.data.error}</p>;
}

export default AxiosBaseError;
