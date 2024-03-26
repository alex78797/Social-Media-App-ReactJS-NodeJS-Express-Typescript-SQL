import { pool } from "../config/postgreSQL.config";
import { User } from "../models/user.model";

/**
 * SQL code that retreives the user who created the comment from the database
 * @param commentId
 * @returns
 */
export async function getCommentAuthorDB(commentId: string): Promise<User> {
  const sqlQuery =
    "SELECT users.*  " +
    "FROM comments JOIN users ON (users.user_id = comments.user_id) " +
    "WHERE comments.comment_id = $1";
  const data = await pool.query(sqlQuery, [commentId]);
  return data.rows[0];
}

/**
 * SQL code that retreives the user who created the post from the database
 * @param postId
 * @returns
 */
export async function getPostAuthorDB(postId: string): Promise<User> {
  const sqlQuery =
    "SELECT users.* " +
    "FROM posts JOIN users ON (users.user_id = posts.user_id) " +
    "WHERE posts.post_id = $1";
  const data = await pool.query(sqlQuery, [postId]);
  return data.rows[0];
}

/**
 * SQL code that returns a user with a given id
 * @param userId
 * @returns
 */
export async function getUserDB(userId: string): Promise<User> {
  const sqlQuery = "SELECT * FROM users WHERE user_id = $1";
  const data = await pool.query(sqlQuery, [userId]);
  return data.rows[0];
}

/**
 * SQL code that returns a user with a given id
 * @param userId
 * @returns
 */
export async function getAllUsersDB(): Promise<User[]> {
  const sqlQuery = "SELECT * FROM users";
  const data = await pool.query(sqlQuery);
  return data.rows;
}

/**
 * SQL code that updates a user
 * @param name
 * @param city
 * @param website
 * @param profilePicture
 * @param coverPicture
 * @param userId
 */
export async function updateUserDB(
  name: string,
  city: string,
  website: string,
  profilePicture: string,
  coverPicture: string,
  userId: string
): Promise<void> {
  const sqlQuery =
    "UPDATE users SET user_name = $1, city = $2, website = $3, profile_picture = $4, cover_picture = $5 WHERE user_id = $6";
  await pool.query(sqlQuery, [
    name,
    city,
    website,
    profilePicture,
    coverPicture,
    userId,
  ]);
}

/**
 * SQL code that changes/updates the password of the user with the given id
 * @param password
 * @param refreshTokens
 * @param userId
 */
export async function resetPasswordDB(
  password: string,
  userId: string
): Promise<void> {
  const sqlQuery = "UPDATE users SET user_password = $1 WHERE user_id = $2 ";
  await pool.query(sqlQuery, [password, userId]);
}

/**
 * SQL code that deletes the user with the given id
 * @param userId
 */
export async function deleteUserDB(userId: string): Promise<void> {
  const sqlQuery = "DELETE FROM users WHERE user_id = $1";
  await pool.query(sqlQuery, [userId]);
}
