import fs from "fs";
import * as FileType from "file-type";
import { getAllUsersDB } from "../services/users.service";

/**
 * Scheduled job/function which removes a file from the folder, where the media type is not `image/png` or `image/jpeg`.
 *
 * The intervall, at which this job/function runs is defined in app.ts.
 *
 * @param folder
 */
export async function cleanPublicFolder() {
  const allUsers = await getAllUsersDB();
  for (const user of allUsers) {
    const folder = "../SERVER_BACKEND/src/public/" + user.user_id;
    const files = fs.readdirSync(folder);
    for (const file of files) {
      try {
        const fileType = await FileType.fromFile(folder + "/" + file);
        if (
          !fileType ||
          (fileType &&
            fileType.mime !== "image/png" &&
            fileType.mime !== "image/jpeg")
        ) {
          fs.unlinkSync(folder + "/" + file);
          console.log("Removed file: " + folder + "/" + file);
        }
      } catch (error) {
        console.log("Error while cleaning...");
      }
    }
    console.log("Done cleaning: " + folder);
  }
}
