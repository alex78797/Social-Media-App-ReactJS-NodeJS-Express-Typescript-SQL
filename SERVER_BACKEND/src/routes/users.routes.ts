import express from "express";
import {
  deleteUser,
  getCommentAuthor,
  getPostAuthor,
  getUser,
  resetPassword,
  updateUser,
} from "../controllers/users.controller";
import { verifyJWT } from "../middleware/verifyJWT.middleware";

export const usersRouter = express.Router();

usersRouter.get("/findPostAuthor/:postId", verifyJWT, getPostAuthor);
usersRouter.get("/findCommentAuthor/:commentId", verifyJWT, getCommentAuthor);
usersRouter.get("/findUser/:userId", verifyJWT, getUser);
usersRouter.put("/", verifyJWT, updateUser);
usersRouter.put("/resetPassword", verifyJWT, resetPassword);
usersRouter.delete("/deleteAccount", verifyJWT, deleteUser);
