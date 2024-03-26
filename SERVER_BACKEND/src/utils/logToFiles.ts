import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";

export async function logEventsToFiles(message: string, logFileName: string) {
  try {
    const dateTime = new Date();
    const logItem = `${dateTime}\t${message}\n`;

    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log("Error when logging events!");
    console.log(error);
  }
}
