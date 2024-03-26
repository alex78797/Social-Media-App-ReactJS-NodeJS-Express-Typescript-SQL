import { NextFunction, Response } from "express";
import { UserRequest } from "../userRequestTypes/userRequest.types";
import {
  createPostDB,
  deletePostDB,
  getAllUsersAndFollowedUsersPostsDB,
  getPostDB,
} from "../services/posts.service";
import { sanitizeUserInput } from "../utils/sanitizeUserInput";
import { Post } from "../models/post.models";
import validator from "validator";
import fs from "fs";
/**
 * @description returns all the posts of the current user and the posts of the users, that the current user (the user making the request) is following
 * @route GET /api/posts/
 * @access private user has to log in to access the route
 */
export async function getAllUsersAndFollowedUsersPosts(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId: string = req.query.userId as string;
    if (!validator.isUUID(userId)) {
      return res.status(400).json({ error: "Invalid id." });
    }
    const userPosts = await getAllUsersAndFollowedUsersPostsDB(userId);
    return res.status(200).json(userPosts);
  } catch (error) {
    next(error);
  }
}

/**
 * @description Creates a new post with the user's input
 * @route POST /api/posts/
 * @access private user has to log in to access the route
 */
export async function createPost(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userInput = sanitizeUserInput(req.body) as Post;
    const description: string = userInput.post_description;
    const img: string = userInput.img;
    if (!description && !img) {
      return res.sendStatus(204);
    }
    await createPostDB(description, img, req.user_id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

/**
 * @description Deletes a post made by a particular user
 * @route DELETE /api/posts/
 * @access private user has to log in to access the route
 */
export async function deletePost(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = req.params.postId;
    if (!validator.isUUID(postId)) {
      return res.status(400).json({ error: "Invalid id." });
    }
    const post = await getPostDB(postId);
    // if the post contains an img, remove the img from the folder
    if (post.img) {
      fs.unlinkSync(
        "../SERVER_BACKEND/src/public/" + req.user_id + "/" + post.img
      );
    }
    await deletePostDB(postId, req.user_id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
