import multer from "multer";
import { UserRequest } from "../userRequestTypes/userRequest.types";
import path from "path";
import * as FileType from "file-type";
import mime from "mime-types";

const storageServer = multer.diskStorage({
  destination: function (req: UserRequest, file, cb) {
    // Copy the relative path of the folder where you want to save the file, paste it (as string), and add `../` in front of the path
    cb(null, "../SERVER_BACKEND/src/public/" + req.user_id);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

/**
 * Upload filter function used with multer, which filters files based on extension and media type.
 *
 * PROBLEM: if a user changes the extension of a .txt file to .png, this function will not filter the file.
 *  ----> use a file-type validator in uploadFile.controller.ts
 */
async function uploadFilter(req: UserRequest, file: Express.Multer.File, cb) {
  const fileExtension = path.extname(file.originalname);
  // console.log(fileExtension);
  if (
    fileExtension !== ".png" &&
    fileExtension !== ".jpg" &&
    fileExtension !== ".jpeg"
  ) {
    return cb(null, false);
  }
  const mediaType = file.mimetype;
  // console.log(mediaType);
  if (mediaType !== "image/png" && mediaType !== "image/jpeg") {
    return cb(null, false);
  }
  return cb(null, true);
}

const uploadServer = multer({
  storage: storageServer,
  fileFilter: uploadFilter,
});

export const uploadSingleFileServer = uploadServer.single("file");
