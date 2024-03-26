import express from "express";
import {
  addAndDeleteRelationship,
  getAllRelationships,
  getRelationship,
} from "../controllers/relationships.controller";
import { verifyJWT } from "../middleware/verifyJWT.middleware";

export const relationshipsRouter = express.Router();

relationshipsRouter.get("/", verifyJWT, getRelationship);
relationshipsRouter.get("/all", verifyJWT, getAllRelationships);
relationshipsRouter.post("/", verifyJWT, addAndDeleteRelationship);
