import { pool } from "../config/postgreSQL.config";
import { Relationship } from "../models/relationship.model";

export async function getRelationshipDB(
  followedUserId: string
): Promise<Relationship> {
  const sqlQuery = "SELECT * FROM relationships WHERE followed_user_id = $1";
  const data = await pool.query(sqlQuery, [followedUserId]);
  return data.rows[0];
}

export async function getAllFollowedUsersDB(
  userId: string
): Promise<Relationship[]> {
  const sqlQuery = "SELECT * FROM relationships WHERE follower_user_id = $1";
  const data = await pool.query(sqlQuery, [userId]);
  return data.rows;
}

export async function addRelationshipDB(
  followerUserId: string,
  followedUserId: string
): Promise<void> {
  const sqlQuery =
    "INSERT INTO relationships (follower_user_id, followed_user_id) VALUES ($1, $2)";
  await pool.query(sqlQuery, [followerUserId, followedUserId]);
}

export async function deleteRelationshipDB(
  followerUserId: string,
  followedUserId: string
): Promise<void> {
  const sqlQuery =
    "DELETE FROM relationships WHERE follower_user_id = $1 AND followed_user_id = $2";
  await pool.query(sqlQuery, [followerUserId, followedUserId]);
}
