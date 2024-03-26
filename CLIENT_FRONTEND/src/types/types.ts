/**
 * The properties of a User
 */
export interface IUser {
  user_id: string;
  user_name: string;
  email: string;
  real_name: string;
  roles: string[];
  cover_picture: string;
  profile_picture: string;
  city: string;
  website: string;
  created_at: string;
}

/**
 * The properties of a relationship
 */
export interface IRelationship {
  relationship_id: string;
  follower_user_id: string;
  followed_user_id: string;
  created_at: string;
  
}

/**
 * The properties of a post
 */
export interface IPost {
  post_id: string;
  post_description: string;
  img: string;
  created_at: string;
  user_id: string;
}

/**
 * The properties of a like
 */
export interface ILike {
  like_id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

/**
 * The properties of a comment
 */
export interface IComment {
  comment_id: string;
  comment_description: string;
  post_id: string;
  created_at: string;
  user_id: string;
}
