import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware";
import { uploadFile } from "../controllers/uploadFile.controller";

export const uploadFilerRouter = express.Router();

uploadFilerRouter.post("/", verifyJWT, uploadFile);
