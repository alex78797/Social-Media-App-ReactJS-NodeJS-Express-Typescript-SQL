import Container from "react-bootstrap/Container";
import { useAppSelector } from "../app/hooks";
import { useDeleteCommentMutation } from "../features/comments/commentsApiSlice";
import { useGetCommentAuthorQuery } from "../features/users/usersApiSlice";
import { IComment } from "../types/types";
import Button from "react-bootstrap/esm/Button";
import AxiosBaseError from "./AxiosBaseError";

/**
 *
 * @param comment
 * @returns A component which shows a particular comment with its author.
 */
function Comment({ comment }: { comment: IComment }) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [deleteComment, { error: deleteCommentError }] =
    useDeleteCommentMutation();

  const { data: commentAuthor, error: getCommentAuthorError } =
    useGetCommentAuthorQuery(comment.comment_id);

  /**
   * When the user clicks the delete comment button, it triggers this method
   * which makes a DELETE request to delete his comment.
   * @param e
   */
  async function handleDeleteComment(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    e.preventDefault();
    await deleteComment(comment.comment_id).unwrap();
  }

  return (
    <Container className="border mb-3 rounded">
      <h6 className="my-2">{commentAuthor?.user_name}</h6>
      <p className="mb-2">{comment.comment_description}</p>
      {/* show the delete button only if it was written by the current user */}
      {currentUser && currentUser.user_id === comment.user_id && (
        <Button
          variant="outline-danger"
          className="mb-3"
          onClick={handleDeleteComment}
        >
          Delete Comment
        </Button>
      )}
      {/* display the error message from the server if an error occured */}
      {getCommentAuthorError && (
        <AxiosBaseError error={getCommentAuthorError} />
      )}

      {/* display the error message from the server if an error occured */}
      {deleteCommentError && <AxiosBaseError error={deleteCommentError} />}
    </Container>
  );
}

export default Comment;
