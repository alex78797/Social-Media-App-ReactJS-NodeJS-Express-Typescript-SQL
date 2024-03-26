import { NextFunction, Request, Response } from "express";
import { logEventsToFiles } from "../utils/logToFiles";
import { UserRequest } from "../userRequestTypes/userRequest.types";

/**
 * Request handler middleware, which logs to a file all the request that are made by the users.
 * @param req
 * @param res
 * @param next
 */
export function logEvents(req: UserRequest, res: Response, next: NextFunction) {
  logEventsToFiles(
    req.method + "\t" + req.url + "\t" + req.headers.origin,
    "requestLogs.log"
  );
  next();
}
