# Social Media Application

- Full-stack application, where users can login on multiple devices, edit their account, delete their account and
  automatically all the data associated with that account from the database.

- Users can also follow other users, like other users’ posts, comment on posts or delete their own posts.
  Users can see their own posts and the posts of the users they follow.

- Authentication is persistent and is implemented with JSON Web Tokens (JWTs) access tokens (stored in memory) and refresh tokens (stored in the database and sent to the client as http-only secure cookie).

- BCrypt is used to securely store passwords. User inputs and file uploads are validated. The API calls are rate-limited.

- Application also features scheduled jobs to constantly check the uploads for unwanted media types.
