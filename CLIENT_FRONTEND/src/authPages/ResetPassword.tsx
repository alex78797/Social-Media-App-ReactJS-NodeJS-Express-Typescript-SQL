import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useState } from "react";
import { useResetPasswordMutation } from "../features/users/usersApiSlice";
import { useAppDispatch } from "../app/hooks";
import { removeCredentials } from "../features/auth/authSlice";
import { apiSlice } from "../app/api/apiSlice";
import AxiosBaseError from "../components/AxiosBaseError";

/**
 *
 * @returns A page where a user can reset/change its password.
 */
function ResetPassword() {
  const [resetPassword, { error }] = useResetPasswordMutation();

  const dispatch = useAppDispatch();

  const [userInput, setUserInput] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  /**
   * When the user types in the form, it triggers this method
   * which makes the changes in the form visible (state updates)
   * @param e
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    console.log(userInput);
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * When a user clicks the reset password button, it triggers this method which
   * first prevents the default browser behaviour to refresh the page
   * and then makes a POST request to reset the password.
   *
   * Then, the method removes the credentials (user properties and access) from the global store
   * and deletes all the previous state.
   *
   * (Finally, the method automatically redirects to the login page.)
   */
  async function handleResetPassword(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    await resetPassword({
      old_password: userInput.old_password,
      new_password: userInput.new_password,
      new_password_confirm: userInput.new_password_confirm,
    }).unwrap();
    dispatch(removeCredentials());
    dispatch(apiSlice.util.resetApiState());
  }

  return (
    <Container className="d-flex align-items-center flex-column my-4">
      <h1>Reset Password</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            name="oldPassword"
            type="password"
            placeholder="Enter old password"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            name="newPassword"
            type="password"
            placeholder="Enter  new  password"
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Password must contain minimum 12 characters and include lower case
            letters, upper case letters, numbers and special characters!
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="newPasswordConfirm"
            type="password"
            placeholder="Confirm new  password"
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Password must contain minimum 12 characters and include lower case
            letters, upper case letters, numbers and special characters!
          </Form.Text>
        </Form.Group>

        {error && <AxiosBaseError error={error} />}

        <Button variant="primary" type="submit" onClick={handleResetPassword}>
          Reset Password
        </Button>
      </Form>
    </Container>
  );
}

export default ResetPassword;
