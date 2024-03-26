import express from "express";
import {
  createPost,
  deletePost,
  getAllUsersAndFollowedUsersPosts,
} from "../controllers/posts.controller";
import { verifyJWT } from "../middleware/verifyJWT.middleware";

export const postsRouter = express.Router();

postsRouter.get("/", verifyJWT, getAllUsersAndFollowedUsersPosts);
postsRouter.post("/", verifyJWT, createPost);
postsRouter.delete("/:postId", verifyJWT, deletePost);
