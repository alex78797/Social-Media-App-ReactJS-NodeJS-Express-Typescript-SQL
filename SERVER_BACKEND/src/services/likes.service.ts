import { pool } from "../config/postgreSQL.config";
import { Like } from "../models/like.model";

/**
 * SQL code that returns all ids of the users who liked a particular post
 * @param postId the id of that particular post
 */
export async function getPostLikesDB(postId: string): Promise<Like[]> {
  const sqlQuery = "SELECT * FROM likes WHERE post_id = $1";
  const data = await pool.query(sqlQuery, [postId]);
  return data.rows;
}

/**
 * SQL code that inserts the id of the user who likes a post, and the id of the post liked by the user
 * @param userId
 * @param postId
 */
export async function addLikeDB(postId: string, userId: string): Promise<void> {
  const sqlQuery = "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)";
  await pool.query(sqlQuery, [postId, userId]);
}

/**
 * SQL code that deletes the like made by a particular user on a particular post
 * @param userId
 * @param postId
 */
export async function deleteLikeDB(
  userId: string,
  postId: string
): Promise<void> {
  const sqlQuery = "DELETE FROM likes WHERE user_id = $1 AND post_id = $2";
  await pool.query(sqlQuery, [userId, postId]);
}
