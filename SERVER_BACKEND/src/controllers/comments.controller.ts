import { NextFunction, Response } from "express";
import {
  addCommentDB,
  deleteCommentDB,
  getPostCommentsDB,
} from "../services/comments.service";
import { UserRequest } from "../userRequestTypes/userRequest.types";
import { sanitizeUserInput } from "../utils/sanitizeUserInput";
import { Comment } from "../models/comment.model";
import validator from "validator";

/**
 * @description returns all comments made on a particular post
 * @route GET /api/comments/
 * @access private user has to be logged in to access the route
 */
export async function getPostComments(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = req.query.postId as string;
    if (!validator.isUUID(postId)) {
      return res.status(400).json({ error: "Invalid id!" });
    }
    const postsComments = await getPostCommentsDB(postId);
    return res.status(200).json(postsComments);
  } catch (error) {
    next(error);
  }
}

/**
 * @description adds a comment to a post
 * @route   POST /api/comments/
 * @access private user has to be logged in to access the route
 */
export async function addComment(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userInput = sanitizeUserInput(req.body) as Comment;
    const description: string = userInput.comment_description;
    const postId: string = userInput.post_id;
    if (description.length === 0) {
      return res.sendStatus(204);
    }
    await addCommentDB(description, req.user_id, postId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

/**
 * @description deletes a comment from a post
 * @route   DELETE /api/comments/:id
 * @access private user has to be logged in to access the route
 */
export async function deleteComment(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const commentId = req.params.commentId;
    if (!validator.isUUID(commentId)) {
      return res.status(400).json({ error: "Invalid id." });
    }
    await deleteCommentDB(commentId, req.user_id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
