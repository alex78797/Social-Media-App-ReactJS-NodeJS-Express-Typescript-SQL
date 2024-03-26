import { NextFunction, Response } from "express";
import { UserRequest } from "../userRequestTypes/userRequest.types";
import {
  addLikeDB,
  deleteLikeDB,
  getPostLikesDB,
} from "../services/likes.service";
import validator from "validator";
import { getPostDB } from "../services/posts.service";

/**
 * @description gets the ids of the users who liked a particular post
 * @route GET /api/likes/
 * @access private user has to be logged in to access the route
 */
export async function getPostLikes(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = req.query.postId as string;
    if (!validator.isUUID(postId)) {
      return res.status(400).json({ error: "Invalid id!" });
    }
    const postLikes = await getPostLikesDB(postId);
    return res.status(200).json(postLikes);
  } catch (error) {
    next(error);
  }
}

/**
 * @description likes a post, or removes the like if the user tries to like a post multiple times
 * @route POST /api/likes/
 * @access private user has to be logged in to access the route
 */
export async function handleLikeAndUnlike(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = req.query.postId as string;
    // const userId = req.query.userId as string;

    const userId = req.user_id;

    if (!validator.isUUID(postId) || !validator.isUUID(userId)) {
      return res.status(400).json({ error: "Invalid id." });
    }

    const postLikes = await getPostLikesDB(postId);
    for (let i = 0; i < postLikes.length; i++) {
      const likeObj = postLikes[i];
      if (likeObj.user_id === userId) {
        await deleteLikeDB(userId, postId);
        return res.sendStatus(204);
      }
    }

    // I should not be able to like my own post :)
    const post = await getPostDB(postId);
    if (post.user_id === req.user_id) {
      return res.sendStatus(204);
    }

    await addLikeDB(postId, userId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
