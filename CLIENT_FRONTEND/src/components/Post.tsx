import Container from "react-bootstrap/Container";
import { useAppSelector } from "../app/hooks";
import {
  useGetAllLikesQuery,
  useHandleLikeAndUnlikeMutation,
} from "../features/likes/likesApiSlice";
import { useDeletePostMutation } from "../features/posts/postsApiSlice";
import { useGetPostAuthorQuery } from "../features/users/usersApiSlice";
import { IPost } from "../types/types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useEffect, useRef, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import CommentSection from "./CommentSection";
import { formatDistance } from "date-fns/formatDistance";
import { useGetAllCommentsQuery } from "../features/comments/commentsApiSlice";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import AxiosBaseError from "./AxiosBaseError";
import { axiosInstance } from "../app/api/axiosInstance";

/**
 *
 * @param param0
 * @returns A component, which displays a particular post
 */
function Post({ post }: { post: IPost }) {
  // use the 'useGetPostAuthorQuery' hook to get the user who made the post from the server
  const {
    data: postAuthor,
    isLoading: postAuthorIsLoading,
    error: getPostAuthorError,
  } = useGetPostAuthorQuery(post.post_id);

  // use the 'useGetAllLikesQuery' hook to get the likes on a particular post from the server
  const {
    data: likes,
    isLoading: postLikesAreLoading,
    error: getPostLikesError,
  } = useGetAllLikesQuery(post.post_id);

  // use the 'useGetAllCommentsQuery' hook to get the comments on a particular post from the server
  const {
    data: comments,
    isLoading: postCommentsAreLoading,
    error: getPostCommentsError,
  } = useGetAllCommentsQuery(post.post_id);

  // use the 'useHandleLikeAndUnlikeMutation' hook to add or remove a like on a particular post
  const [likeAndUnlike, { error: likeAndUnlikeError }] =
    useHandleLikeAndUnlikeMutation();

  // use the 'useDeletePostMutation' hook to delete a particular post
  const [deletePost, { error: deletePostError }] = useDeletePostMutation();

  // get the user making the request from the global state
  const currentUser = useAppSelector((state) => state.auth.user);

  const [imgSrc, setImgSrc] = useState("");

  const [open, setOpen] = useState(false);

  const [imgIsLoading, setImgIsLoading] = useState(true);

  // needed with react 18 (useEffect runs twice in dev mode)
  const effectRan = useRef(false);

  /**
   * When the user clicks the like button, it triggers this method
   * which makes a POST request to like a particular post, or unlike an already appreciated post.
   */
  async function handleLikeAndUnlike() {
    await likeAndUnlike({
      user_id: currentUser?.user_id as string,
      post_id: post.post_id,
    }).unwrap();
  }

  /**
   * When the user clicks the like button, it triggers this method
   * which makes a DELETE request to delete a particular post.
   */
  async function handleDeletePost() {
    const post_id = post.post_id;
    await deletePost(post_id).unwrap();
  }

  /**
   * Retrieve an image from the server as blob.
   * This image will be shown with the post.
   */
  useEffect(() => {
    if (effectRan.current === false) {
      async function fetchImageAsBlob() {
        if (!post.img || post.img === "") {
          // Set the imgIsLoading state to false if the post does not contain any image.
          // Otherwise the imgIsLoading state will remain true and a loading spinner will be shown instead of the post.
          setImgIsLoading(false);
          return;
        }
        try {
          const response = await axiosInstance.get(
            "http://localhost:3000/static/" + post.user_id + "/" + post.img,
            {
              withCredentials: true,
              responseType: "blob",
            }
          );
          setImgSrc(URL.createObjectURL(response.data));
          URL.revokeObjectURL(imgSrc);
        } finally {
          setImgIsLoading(false);
        }
      }
      fetchImageAsBlob();
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  if (
    postAuthorIsLoading ||
    postCommentsAreLoading ||
    postLikesAreLoading ||
    imgIsLoading
  ) {
    return <Loading />;
  }

  return (
    <Container>
      <Card className="w-100 m-auto mb-5">
        {/* show the image if the post contains any image */}
        {post.img && post.img !== "" && <Card.Img variant="top" src={imgSrc} />}
        <Card.Body>
          {/* show error from server if an error occured while retrieving the post author */}
          {getPostAuthorError && <AxiosBaseError error={getPostAuthorError} />}

          {/* when the username (post author) is clicked, go to this user's profile page  */}
          <Link to={`profile/${postAuthor?.user_id}`}>
            <Card.Title>{postAuthor?.user_name}</Card.Title>
          </Link>

          {/* show the description if the post contains any description */}
          {post.post_description && post.post_description !== "" && (
            <Card.Text>{post.post_description}</Card.Text>
          )}

          {/* shows approximately when the post was created */}
          <p>
            {formatDistance(new Date(post.created_at), new Date(), {
              addSuffix: true,
            })}
          </p>
          <ButtonToolbar aria-label="Toolbar with button groups">
            {/* why show "null" / nothing: current user should not be able to like his own posts :) */}
            {currentUser?.user_id ===
            postAuthor?.user_id ? null : likes?.filter(
                (like) => like.user_id === currentUser?.user_id
              ).length === 0 ? (
              <Button
                variant="outline-secondary"
                className="me-3"
                onClick={handleLikeAndUnlike}
              >
                {/* show 'Like' and the total number of likes on that post if the user did not like another user's post  */}
                Like ({likes?.length})
              </Button>
            ) : (
              <Button
                variant="outline-info"
                className="me-3"
                onClick={handleLikeAndUnlike}
              >
                {/* show 'Liked' and the total number of likes on that post if the user did already liked another user's post  */}
                Liked ({likes?.length})
              </Button>
            )}
            {/* show error from server if an error occured while liking / unliking a post */}
            {likeAndUnlikeError && (
              <AxiosBaseError error={likeAndUnlikeError} />
            )}

            {/* show error from server if an error occured while retrieving the likes on a post */}
            {getPostLikesError && <AxiosBaseError error={getPostLikesError} />}
            <Button
              variant="outline-secondary"
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
              className="me-3"
            >
              Comments ({comments?.length})
            </Button>
            {/* show error from server if an error occured while retrieving the comments on a post */}
            {getPostCommentsError && (
              <AxiosBaseError error={getPostCommentsError} />
            )}
            {/* show the delete button on the current user's posts */}
            {currentUser && currentUser.user_id === post.user_id && (
              <ButtonGroup aria-label="Third group">
                <Button
                  variant="outline-danger"
                  className="me-3"
                  onClick={handleDeletePost}
                >
                  Delete Post
                </Button>
              </ButtonGroup>
            )}
            {/* show error from server if an error occured while deleting a post */}
            {deletePostError && <AxiosBaseError error={deletePostError} />}
          </ButtonToolbar>
          {/* show the comment section */}
          <Collapse in={open}>
            <div id="example-collapse-text" className="my-3">
              <CommentSection post={post} />
            </div>
          </Collapse>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Post;
