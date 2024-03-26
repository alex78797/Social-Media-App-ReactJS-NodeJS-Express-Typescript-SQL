CREATE TABLE users (
    user_id uuid default gen_random_uuid(),
	user_name VARCHAR unique not null,
	email VARCHAR unique not null,
	user_password VARCHAR not null,
	real_name VARCHAR unique not null,
	roles VARCHAR[] default array[]::VARCHAR[],
	cover_picture VARCHAR default '',
	profile_picture VARCHAR default '',
	city VARCHAR default '',
	website VARCHAR default '',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (user_id)
);

CREATE TABLE tokens (
 	token_id uuid default gen_random_uuid(),
 	refresh_token VARCHAR unique not null,
	user_id uuid not null,
	created_at TIMESTAMPTZ default now(),
	PRIMARY KEY (token_id),
	CONSTRAINT fk_users
		FOREIGN KEY (user_id) REFERENCES users(user_id)
		ON DELETE CASCADE
);

CREATE TABLE posts (
	post_id uuid default gen_random_uuid(),
	post_description VARCHAR,
	img VARCHAR,
	user_id uuid NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (post_id),
	CONSTRAINT fk_users
		FOREIGN KEY (user_id) REFERENCES users(user_id)
		ON DELETE CASCADE

);

CREATE TABLE comments (
	comment_id uuid default gen_random_uuid(),
	comment_description VARCHAR NOT NULL,
	user_id uuid NOT NULL,
	post_id uuid NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (comment_id),
	CONSTRAINT fk_users
		FOREIGN KEY (user_id) REFERENCES users(user_id)
		ON DELETE CASCADE,
	CONSTRAINT fk_posts
		FOREIGN KEY (post_id) REFERENCES posts(post_id)
		ON DELETE CASCADE
);

CREATE TABLE relationships (
	relationship_id uuid default gen_random_uuid(),
	follower_user_id uuid NOT NULL,
	followed_user_id uuid NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (relationship_id),
	CONSTRAINT fk_users
		FOREIGN KEY (follower_user_id) REFERENCES users(user_id)
		ON DELETE CASCADE,
		FOREIGN KEY (followed_user_id) REFERENCES users(user_id)
		ON DELETE CASCADE
);


CREATE TABLE likes (
	like_id uuid default gen_random_uuid(),
	user_id uuid NOT NULL,
	post_id uuid NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (like_id),
	CONSTRAINT fk_users
		FOREIGN KEY (user_id) REFERENCES users(user_id)
		ON DELETE CASCADE,
	CONSTRAINT fk_posts
		FOREIGN KEY (post_id) REFERENCES posts(post_id)
		ON DELETE CASCADE
);
