import Form from "react-bootstrap/Form";
import {
  useCreateCommentMutation,
  useGetAllCommentsQuery,
} from "../features/comments/commentsApiSlice";
import { useState } from "react";
import { IPost } from "../types/types";
import Button from "react-bootstrap/Button";
import Comment from "./Comment";
import Loading from "./Loading";
import AxiosBaseError from "./AxiosBaseError";

/**
 *
 * @param post
 * @returns A 'comment section', which displays all comments and allows a user to add a comment on a particular post.
 */
function CommentSection({ post }: { post: IPost }) {
  const [addComment, { error: addCommentError }] = useCreateCommentMutation();

  const {
    data: comments,
    isLoading,
    error: getAllCommentsError,
  } = useGetAllCommentsQuery(post.post_id);

  const [comment_description, setCommentDescription] = useState("");

  /**
   * When the user clicks the Add Comment button, it triggers this method
   * which makes a POST request to add a comment on this particular post.
   * @param e
   */
  async function handleAddComment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    // prevent page refresh when submitting form
    e.preventDefault();
    const post_id = post.post_id;
    await addComment({ post_id, comment_description }).unwrap();
    setCommentDescription("");
  }

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            type="text"
            placeholder="Your Comment..."
            onChange={(e) => setCommentDescription(e.target.value)}
            value={comment_description}
          />
          <Button
            className="w-100"
            variant="primary"
            type="submit"
            onClick={handleAddComment}
          >
            Add Comment
          </Button>
          {addCommentError && <AxiosBaseError error={addCommentError} />}
        </Form.Group>
      </Form>
      {/* display the error message from the server if an error occured */}
      {getAllCommentsError && <AxiosBaseError error={getAllCommentsError} />}
      {/* show a loading spinner if data is still loading from the server */}
      {isLoading && <Loading />}
      {/* show the retrieved data */}
      {comments &&
        comments.map((comment) => (
          <Comment key={comment.comment_id} comment={comment} />
        ))}
    </>
  );
}

export default CommentSection;
