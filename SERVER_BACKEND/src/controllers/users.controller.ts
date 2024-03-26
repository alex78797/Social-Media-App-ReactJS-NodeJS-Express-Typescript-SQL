import { NextFunction, Response } from "express";
import { UserRequest } from "../userRequestTypes/userRequest.types";
import {
  deleteUserDB,
  getCommentAuthorDB,
  getPostAuthorDB,
  getUserDB,
  resetPasswordDB,
  updateUserDB,
} from "../services/users.service";
import validator from "validator";
import { User } from "../models/user.model";
import { sanitizeUserInput } from "../utils/sanitizeUserInput";
import bcrypt from "bcryptjs";
import {
  deleteAllUserRefreshTokensDB,
  getUserByIdDB,
} from "../services/auth.service";
import fs from "fs";

export async function getCommentAuthor(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const commentId = req.params.commentId;
    if (!validator.isUUID(commentId)) {
      return res.status(400).json({ error: "Invalid id!" });
    }
    const user = await getCommentAuthorDB(commentId);
    const { user_password, ...otherUserInformation } = user;
    res.status(200).json(otherUserInformation);
  } catch (error) {
    next(error);
  }
}

export async function getPostAuthor(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = req.params.postId;
    if (!validator.isUUID(postId)) {
      return res.status(400).json({ error: "Invalid id!" });
    }
    const user = await getPostAuthorDB(postId);
    const { user_password, ...otherUserInformation } = user;
    res.status(200).json(otherUserInformation);
  } catch (error) {
    next(error);
  }
}

export async function getUser(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;
    if (!validator.isUUID(userId)) {
      return res.status(400).json({ error: "Invalid id!" });
    }
    const user = await getUserDB(userId);
    const { user_password, ...otherUserInformation } = user;
    res.status(200).json(otherUserInformation);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userInput = sanitizeUserInput(req.body) as User;
    await updateUserDB(
      userInput.user_name,
      userInput.city,
      userInput.website,
      userInput.profile_picture,
      userInput.cover_picture,
      req.user_id
    );
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userInput = sanitizeUserInput(req.body) as {
      old_password: string;
      new_password: string;
      new_password_confirm: string;
    };
    if (
      !userInput.old_password ||
      userInput.old_password === "" ||
      !userInput.new_password ||
      userInput.new_password === "" ||
      !userInput.new_password_confirm ||
      userInput.new_password_confirm === ""
    ) {
      return res
        .status(401)
        .json({ error: "A field is missing! Please enter all fields!" });
    }
    const user: User = await getUserByIdDB(req.user_id);
    const oldPasswordsMatch = bcrypt.compareSync(
      userInput.old_password,
      user.user_password
    );
    if (!oldPasswordsMatch) {
      return res.status(401).json({ error: "Wrong passoword!" });
    }
    if (userInput.new_password !== userInput.new_password_confirm) {
      return res.status(401).json({
        error: "The new password and the confirmed password do not match!",
      });
    }

    if (userInput.new_password.length < 12) {
      return res.status(400).json({
        error: "Password must contain at least 12 characters!",
      });
    }

    // this validator allows passwords with only 8 characters
    if (!validator.isStrongPassword(userInput.new_password)) {
      return res.status(400).json({
        error:
          "Password must include small letters, capital letters, numbers and special characters!",
      });
    }

    const salt: string = await bcrypt.genSalt(12);
    const hashedPassword: string = await bcrypt.hash(
      userInput.new_password,
      salt
    );
    await deleteAllUserRefreshTokensDB(req.user_id);
    await resetPasswordDB(hashedPassword, req.user_id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userInput = sanitizeUserInput(req.body) as {
      password: string;
    };
    if (!userInput.password) {
      return res.status(401).json({ error: "Please enter all fields!" });
    }
    const user: User = await getUserByIdDB(req.user_id);
    const passwordsMatch = bcrypt.compareSync(
      userInput.password,
      user.user_password
    );
    if (!passwordsMatch) {
      return res.status(401).json({ error: "Wrong passoword!" });
    }
    fs.rmSync("../SERVER_BACKEND/src/public/" + req.user_id, {
      recursive: true,
      force: true,
    });
    await deleteUserDB(req.user_id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
