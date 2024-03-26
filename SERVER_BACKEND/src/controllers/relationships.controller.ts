import { NextFunction, Response } from "express";
import { UserRequest } from "../userRequestTypes/userRequest.types";
import {
  addRelationshipDB,
  deleteRelationshipDB,
  getAllFollowedUsersDB as getAllRelationshipsDB,
  getRelationshipDB,
} from "../services/relationships.service";
import validator from "validator";

/**
 * @description gets a relationship between two users
 * @route GET /api/relationships/
 * @access private user has to be logged in to access the route
 */
export async function getRelationship(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const followedUserId = req.query.followedUserId as string;
    if (!validator.isUUID(followedUserId)) {
      return res.status(400).json({ error: "Invalid id!" });
    }
    const relationship = await getRelationshipDB(followedUserId);
    return res.status(200).json(relationship);
  } catch (error) {
    next(error);
  }
}

/**
 * @description gets all follwed users
 * @route GET /api/relationships/all
 * @access private user has to be logged in to access the route
 */
export async function getAllRelationships(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const allFollwedUsers = await getAllRelationshipsDB(req.user_id);
    return res.status(200).json(allFollwedUsers);
  } catch (error) {
    next(error);
  }
}

/**
 * @description adds a relationship, if the user making the request is not already following the user he wants to follow. If the user making the request is already following the user he wants to follow, the method will remove the relationship.
 * @route POST /api/relationships/
 * @access private user has to be logged in to access the route
 */
export async function addAndDeleteRelationship(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.query.userId as string;
    if (!validator.isUUID(userId)) {
      return res.status(400).json({ error: "Invalid id!" });
    }
    const relationship = await getRelationshipDB(userId);
    if (relationship && relationship.follower_user_id === req.user_id) {
      await deleteRelationshipDB(req.user_id, userId);
      return res.sendStatus(204);
    }
    await addRelationshipDB(req.user_id, userId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
