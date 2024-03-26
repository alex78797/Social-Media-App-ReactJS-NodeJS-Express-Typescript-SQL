import { pool } from "../config/postgreSQL.config";
import { IToken } from "../models/token.model";
import { User } from "../models/user.model";
import { hashToken } from "../utils/generateAndHashTokens";

/**
 * SQL code that retreives the user with the given email from the database
 * @param email the email of the user
 * @returns
 */
export async function getUserByEmailDB(email: string): Promise<User> {
  const sqlQuery = "SELECT * FROM users WHERE email = $1";
  const user = await pool.query(sqlQuery, [email]);
  return user.rows[0];
}

/**
 * SQL code that adds a hashed refresh token to the database
 * @param refreshToken
 * @param userId
 */
export async function addUserRefreshTokensDB(
  refreshToken: string,
  userId: string
): Promise<void> {
  const hashedRefreshToken = hashToken(refreshToken);
  const sqlQuery =
    "INSERT INTO tokens (refresh_token, user_id) VALUES ($1, $2)";
  await pool.query(sqlQuery, [hashedRefreshToken, userId]);
}

/**
 * SQL code that deletes a particular refresh token from the database
 * @param refreshToken
 */
export async function deleteUserRefreshTokenDB(refreshToken: string) {
  const hashedRefreshToken = hashToken(refreshToken);
  const sqlQuery = "DELETE FROM tokens WHERE refresh_token = $1";
  await pool.query(sqlQuery, [hashedRefreshToken]);
}

/**
 * SQL code that deletes all the refresh tokens of a particular user
 * @param userId
 */
export async function deleteAllUserRefreshTokensDB(userId: string) {
  const sqlQuery = "DELETE FROM tokens WHERE user_id = $1";
  await pool.query(sqlQuery, [userId]);
}

/**
 * SQL code that inserts a new user in the database
 * @param email
 * @param passoword
 * @param userName
 * @param realName
 */
export async function saveUserDB(
  email: string,
  passoword: string,
  userName: string,
  realName: string
): Promise<void> {
  const sqlQuery =
    "INSERT INTO users (email, user_password, user_name, real_name) VALUES ($1, $2, $3, $4)";
  await pool.query(sqlQuery, [email, passoword, userName, realName]);
}

/**
 * SQL code that retreives the token info stored with a particular refresh token from the database
 * @param refreshToken
 * @returns
 */
export async function getRefreshTokenInfoDB(
  refreshToken: string
): Promise<IToken> {
  const hashedRefreshToken = hashToken(refreshToken);
  const sqlQuery = 'SELECT * FROM tokens WHERE refresh_token = $1';
  const tokenInfo = await pool.query(sqlQuery, [hashedRefreshToken]);
  return tokenInfo.rows[0];
}

/**
 * SQL code that retreives the user with the given id from the database
 * @param userId
 * @returns
 */
export async function getUserByIdDB(userId: string): Promise<User> {
  const sqlQuery = "SELECT * FROM users WHERE user_id = $1";
  const user = await pool.query(sqlQuery, [userId]);
  return user.rows[0];
}
