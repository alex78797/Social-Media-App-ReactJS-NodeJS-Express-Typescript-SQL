import { NextFunction, Request, Response } from "express";
import { logEventsToFiles } from "../utils/logToFiles";
import { UserRequest } from "../userRequestTypes/userRequest.types";

/**
 * Error handler middleware which catches erros in the `catch block`, logs them to a file and to the console,
 * and sends a message to the client, that the request could not be completed.
 *
 * This middleware should come after all the other middleware -> no `next()` at the end of this function
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
export function errorHandler(
  err: Error,
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  // logEventsToFiles(
  //   err.name +
  //     ": " +
  //     err.message +
  //     "\t" +
  //     req.method +
  //     "\t" +
  //     req.url +
  //     "\t" +
  //     req.headers.origin,
  //   "errorLogs.log"
  // );
  res
    .status(500)
    .json({ error: "Did not complete action! An unexpected error occured!" });
}
