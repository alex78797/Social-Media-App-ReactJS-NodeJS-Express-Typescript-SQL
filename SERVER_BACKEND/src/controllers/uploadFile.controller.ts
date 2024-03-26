import { UserRequest } from "../userRequestTypes/userRequest.types";
import { NextFunction, Response } from "express";
import * as FileType from "file-type";
import fs from "fs";
import { uploadSingleFileServer } from "../utils/fileUpload";

/**
 * @description Uploads a file to the server
 * @route POST /api/upload
 * @access private - user has to be logged in to access the route
 */
export async function uploadFile(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  uploadSingleFileServer(req, res, function (err) {
    const file = req.file;
    if (!file) {
      return res.status(415).json({
        error:
          "File can not be uploaded. Check file extension. Only .png .jpg .jpeg allowed.",
      });
    }

    if (err) {
      // return res.status(500).json({
      //   error: "Did not complete action! An unexpected error occured!",
      // });
      next(err);
    }

    // file-type version 16.5.4 is used. The newest version causes import errors (ESM).
    // This package is for detecting binary-based file formats, not text-based formats like .txt, .csv, .svg, etc.
    FileType.fromFile(file.path)
      .then((fileType) => {
        if (
          !fileType ||
          (fileType &&
            fileType.mime !== "image/png" &&
            fileType.mime !== "image/jpeg")
        ) {
          fs.unlinkSync(file.path);
          return res.status(415).json({
            error:
              "File can not be uploaded. Check file extension. Only .png .jpg .jpeg allowed.",
          });
        }
        return res.status(200).json(file.filename);
      })
      .catch((err) => {
        next(err);
      });
  });
}
