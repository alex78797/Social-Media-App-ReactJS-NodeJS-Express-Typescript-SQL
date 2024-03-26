import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

/**
 * Extends the JwtPayload interface with the properties of the user signed
 * by the access token and refresh token
 */
export interface UserJwtPayload extends JwtPayload {
  user_id: string;
  user_roles: string[];
}

/**
 * Properties of a request made by a user.
 * Extends the Request interface/object from express by adding
 * the id and the roles of the user making the request
 * to the Request object.
 */
export interface UserRequest extends Request {
  user_id: string;
  user_roles: string[];
}
