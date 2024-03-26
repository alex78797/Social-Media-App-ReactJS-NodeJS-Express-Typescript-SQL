import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import {
  UserJwtPayload,
  UserRequest,
} from "../userRequestTypes/userRequest.types";
import { sanitizeUserInput } from "../utils/sanitizeUserInput";

/**
 * Verifies if the access token (here JSON Web Token (JWT)) is valid.
 * If the JWT is valid, the user is authorized to make the request, otherwise it is not authorized.
 */
export async function verifyJWT(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  // verify authorization headers (the header can be called either `authorization` or `Authorization` -> consider both cases)
  const authorizationHeader: string =
    req.headers.authorization || (req.headers.Authorization as string);

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer" + " ")) {
    return res.sendStatus(401);
  }

  // get the access token from the authorization header. The authorization header must be of the form "Bearer" + " " + token
  const accessToken = sanitizeUserInput(
    authorizationHeader.split(" ")[1]
  ) as string;

  try {
    // verify the access token and decode its signed properties
    const decodedUserInformation = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    ) as UserJwtPayload;

    // add the id and the roles of the user making the request to the request object.
    req.user_id = sanitizeUserInput(decodedUserInformation.user_id) as string;
    req.user_roles = sanitizeUserInput(
      decodedUserInformation.user_roles
    ) as string[];

    // go to the next middleware in line(or to the next route)
    next();
  } catch (error) {
    // Some possible reasons for error: access token expired, someone tempered it,
    // someone entered in the headers an access token signed with the wrong secret.
    res.sendStatus(403);
  }
}
