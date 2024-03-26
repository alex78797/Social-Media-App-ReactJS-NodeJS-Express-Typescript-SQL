import { Button, Container, Form } from "react-bootstrap";
import { IUser } from "../types/types";
import { useState } from "react";
import { useUpdateUserMutation } from "../features/users/usersApiSlice";
import { useUploadFileMutation } from "../features/uploadFile/uploadFileApiSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { updateUserProperties } from "../features/auth/authSlice";
import AxiosBaseError from "./AxiosBaseError";

function EditProfileForm({ user }: { user: IUser }) {
  const navigate = useNavigate();

  const [updateUser, { error: updateUserError }] = useUpdateUserMutation();

  const [sendFile, { error: sendFileError }] = useUploadFileMutation();

  // use the 'useAppDispatch' hook to send data to the global state.
  const dispatch = useAppDispatch();

  const [userProperties, setUserProperties] = useState({
    user_name: user.user_name,
    city: user.city,
    website: user.website,
  });

  const [cover, setCover] = useState<File | null>(null);
  const [profile, setProfile] = useState<File | null>(null);

  /**
   * When the user types in the form, it triggers this method
   * which makes the changes in the form visible (state updates)
   * @param e
   */
  function handleChangeUserProperties(e: React.ChangeEvent<HTMLInputElement>) {
    setUserProperties({
      ...userProperties,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Makes a POST request to upload a file to a server.
   * @param file
   * @returns
   */
  async function uploadPicture(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await sendFile(formData).unwrap();
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * When the user clicks the edit user button, to submit the form, it triggers this method
   * which makes a POST request to update the properties (e.g. cover picture, or profile picture, or city, or website, or...)
   * and then navigates to the user profile page.
   * @param e
   */
  async function handleEditUser(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    // prevent page refresh when submitting form
    e.preventDefault();

    const coverUrl = cover ? await uploadPicture(cover) : user.cover_picture;

    const profileUrl = profile
      ? await uploadPicture(profile)
      : user.profile_picture;

    // send the 'body' to the server. The server updates the user with these values.
    await updateUser({
      ...userProperties,
      cover_picture: coverUrl as string,
      profile_picture: profileUrl as string,
    }).unwrap();

    // send the updated user data to the global state
    dispatch(
      updateUserProperties({
        ...userProperties,
        cover_picture: coverUrl as string,
        profile_picture: profileUrl as string,
      })
    );

    // navigate to the user profile page
    navigate(`/profile/${user.user_id}`);
  }

  return (
    <Container className="my-5">
      <h1>Edit Account</h1>
      <Form>
        {/* form for sending text to the server */}
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="user_name"
            value={userProperties.user_name}
            placeholder="Enter new username"
            onChange={handleChangeUserProperties}
          />
        </Form.Group>

        {/* form for sending text to the server */}
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={userProperties.city}
            placeholder="Enter new city"
            onChange={handleChangeUserProperties}
          />
        </Form.Group>

        {/* form for sending text to the server */}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="text"
            name="website"
            value={userProperties.website}
            placeholder="Enter new website"
            onChange={handleChangeUserProperties}
          />
        </Form.Group>

        {/* form for sending files to the server */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Cover Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCover(e.target.files![0])
            }
          />
        </Form.Group>

        {/* form for sending files to the server */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfile(e.target.files![0])
            }
          />
        </Form.Group>

        {/* show error message from the server if an error occured while updating the user */}
        {updateUserError && <AxiosBaseError error={updateUserError} />}

        {sendFileError && <AxiosBaseError error={sendFileError} />}

        <Button variant="primary" type="submit" onClick={handleEditUser}>
          Edit Account
        </Button>
      </Form>
    </Container>
  );
}

export default EditProfileForm;
