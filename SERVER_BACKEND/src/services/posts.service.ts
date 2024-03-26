import { pool } from "../config/postgreSQL.config";
import { Post } from "../models/post.models";

/**
 * Sql code that returns all the posts of the current user
 * and the posts of the users,
 * that the current user (the user making the request) is following.
 *
 * @param userId the id of the user who wants to see all these posts (the user making the request to get all these posts)
 */
export async function getAllUsersAndFollowedUsersPostsDB(
  userId: string
): Promise<Post[]> {
  const sqlQuery =
    "SELECT posts.* " +
    "FROM posts LEFT JOIN relationships ON (posts.user_id = relationships.followed_user_id) " +
    "WHERE relationships.follower_user_id = $1 OR posts.user_id = $2 " +
    "ORDER BY posts.created_at DESC";
  const data = await pool.query(sqlQuery, [userId, userId]);
  return data.rows;
}

/**
 * Sql code that returns the post with a particular id from the database.
 * @param postId the id of the post.
 * @returns
 */
export async function getPostDB(postId: string): Promise<Post> {
  const sqlQuery = "SELECT * FROM posts WHERE post_id = $1";
  const data = await pool.query(sqlQuery, [postId]);
  return data.rows[0];
}

/**
 * Sql code that inserts a new post in the database with the input provided by the user
 * @param description the content of the post provided by the user
 * @param img the image the user wants to upload in the post
 * @param userId the id of the user who wants to upload a post (the user making the request to create a new post)
 */
export async function createPostDB(
  description: string,
  img: string,
  userId: string
): Promise<void> {
  const sqlQuery =
    "INSERT INTO posts (post_description, img, user_id) VALUES ($1, $2, $3)";
  await pool.query(sqlQuery, [description, img, userId]);
}

/**
 * Sql code that deletes a particular post made by a particular user.
 * A user can only delete his post.
 * @param postId the id of the post.
 * @param userId the id of the user who created the post.
 */
export async function deletePostDB(
  postId: string,
  userId: string
): Promise<void> {
  const sqlQuery = "DELETE FROM posts WHERE post_id = $1 AND user_id = $2";
  await pool.query(sqlQuery, [postId, userId]);
}
