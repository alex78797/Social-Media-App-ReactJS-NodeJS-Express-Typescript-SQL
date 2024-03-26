import express from "express";
import {
  getPostLikes,
  handleLikeAndUnlike,
} from "../controllers/likes.controller";
import { verifyJWT } from "../middleware/verifyJWT.middleware";

export const likesRouter = express.Router();
likesRouter.get("/", verifyJWT, getPostLikes);
likesRouter.post("/", verifyJWT, handleLikeAndUnlike);
