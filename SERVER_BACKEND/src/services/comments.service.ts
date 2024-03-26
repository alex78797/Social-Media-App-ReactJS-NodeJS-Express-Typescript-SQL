import { pool } from "../config/postgreSQL.config";

/**
 * SQL code that returns all comments made on a particular post.
 *
 * @param postId the id of the post
 */
export async function getPostCommentsDB(postId: string) {
  const sqlQuery =
    "SELECT * FROM comments " +
    "WHERE comments.post_id = $1 " +
    "ORDER BY comments.created_at DESC";
  const data = await pool.query(sqlQuery, [postId]);
  return data.rows;
}

/**
 * SQL code that inserts a comment made on a particular post in the database.
 * @param description
 * @param userId
 * @param postId
 */
export async function addCommentDB(
  description: string,
  userId: string,
  postId: string
): Promise<void> {
  const sqlQuery =
    "INSERT INTO comments (comment_description, user_id, post_id) VALUES ($1, $2, $3)";
  await pool.query(sqlQuery, [description, userId, postId]);
}

/**
 * SQL code that deletes a particular comment made by a particular user.
 * A user can only delete his comment.
 * @param commentId he id of the comment
 * @param userId the id of the user who made the comment
 */
export async function deleteCommentDB(
  commentId: string,
  userId: string
): Promise<void> {
  const sqlQuery =
    "DELETE FROM comments WHERE comment_id = $1 AND user_id = $2";
  await pool.query(sqlQuery, [commentId, userId]);
}
