import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { postsRouter } from "./routes/posts.routes";
import { authRouter } from "./routes/auth.routes";
import { commentsRouter } from "./routes/comments.routes";
import { likesRouter } from "./routes/likes.routes";
import { usersRouter } from "./routes/users.routes";
import { relationshipsRouter } from "./routes/relationships.routes";
import { uploadFilerRouter } from "./routes/uploadFile.routes";
import { limiter } from "./middleware/rateLimit.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { cleanPublicFolder } from "./scheduledJobs/cleanFolders";
import schedule from "node-schedule";
import { verifyJWT } from "./middleware/verifyJWT.middleware";
import path from "path";
import { logEvents } from "./middleware/logger.middleware";

// initialize the app/server
const app = express();

// save the port number from the .env file
const port = process.env.PORT;

// some extra security (if the images from the public folder are not retrieved with fetch API, this will cause an error)
app.use(helmet());

// configure cors with the allowed origin and also allow sending cookies
// first origin is for vite in dev mode, second origin is for vite in production preview mode
// client app is here a React app built with a tool called `vite`, and not with `create-react-app`
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    credentials: true,
  })
);


// needed to send/receive data in json format to/from the client
app.use(express.json());

// needed to send/receive cookies to/from the client
app.use(cookieParser());

// serve static files. files are protected from unauthorized users.
app.use("/static", [verifyJWT, express.static(path.join(__dirname, "public"))]);

// use the limiter middleware to help prevent brute-force attacks: limit the amount of requests possible within a time period
app.use(limiter);

// use the log events middleware
// app.use(logEvents);

// use the created routes
app.use("/api/upload", uploadFilerRouter);

app.use("/api/auth", authRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/relationships", relationshipsRouter);
app.use("/api/users", usersRouter);

// use the error handler middleware
app.use(errorHandler);

// Scheduled job. These job runs every 5 seconds.
// const job = schedule.scheduleJob(
//   "*/5 * * * * *",
//   async () => await cleanPublicFolder()
// );

// run the server on the given port
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
