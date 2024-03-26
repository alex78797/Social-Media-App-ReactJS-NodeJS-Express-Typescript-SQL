import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  useCreateAndDeleteRelationshipMutation,
  useGetRelationshipQuery,
} from "../features/relationships/relationshipsApiSlice";
import NoProfilePic from "/img/No_image_available.svg.png";
import NoCoverPic from "/img/no-picture-available-icon-1.png";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../types/types";
import AxiosBaseError from "./AxiosBaseError";
import { axiosInstance } from "../app/api/axiosInstance";

function ProfileComponent({ user }: { user: IUser }) {
  const navigate = useNavigate();

  const [imgSrcProfilePic, setImgSrcProfilePic] = useState("");
  const [imgSrcCoverPic, setImgSrcCoverPic] = useState("");

  // use the 'useGetRelationshipQuery'
  const { data: relationship, error: relationshipError } =
    useGetRelationshipQuery(user.user_id);

  // use the 'useCreateAndDeleteRelationshipMutation'
  const [
    handleCreateAndDeleteRelationship,
    { error: createAndDeleteRelationshipError },
  ] = useCreateAndDeleteRelationshipMutation();

  // get the user making the request from the global store
  const currentUser = useAppSelector((state) => state.auth.user);

  // needed with react 18 (useEffect runs twice in dev mode)
  const effectRan = useRef(false);

  /**
   * When the user clicks the button, it triggers this method
   * which makes a POST request to add or remove a relationship from the database.
   */
  async function handleFollowAndUnfollow() {
    await handleCreateAndDeleteRelationship(user.user_id);
  }

  /**
   * When the user clicks the button, it triggers this method
   * navigates the user to the edit page.
   */
  function handleGoToEditAccountPage() {
    navigate(`/edit`);
  }

  /**
   * Retrieve an image from the server as blob.
   * This image will be shown with the post.
   */
  useEffect(() => {
    if (effectRan.current === false) {
      async function fetchImageAsBlob() {
        let response;

        response = await axiosInstance.get(
          "http://localhost:3000/static/" +
            user?.user_id +
            "/" +
            user?.profile_picture,
          {
            withCredentials: true,
            responseType: "blob",
          }
        );
        setImgSrcProfilePic(URL.createObjectURL(response.data));
        URL.revokeObjectURL(imgSrcProfilePic);

        response = await axiosInstance.get(
          "http://localhost:3000/static/" +
            user?.user_id +
            "/" +
            user?.cover_picture,
          {
            withCredentials: true,
            responseType: "blob",
          }
        );
        setImgSrcCoverPic(URL.createObjectURL(response.data));
        URL.revokeObjectURL(imgSrcCoverPic);
      }
      fetchImageAsBlob();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  // show error message from the server if an error occured
  if (relationshipError) {
    return <AxiosBaseError error={relationshipError} />;
  }

  return (
    <Container className="d-flex justify-content-center">
      <Card>
        <div>
          {/* show the cover picture of the user or an alternative image if the user does not have any cover picture */}
          <Image
            src={user?.cover_picture ? imgSrcCoverPic : NoCoverPic}
            fluid
            width="100%"
          />
        </div>

        {/* overlap the cover picutre with the profile picture, center the profile picture horizontally */}
        <div className="position-relative text-center">
          <div
            className="position-absolute"
            style={{
              top: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {/* show the profile picture of the user or an alternative image if the user does not have any profile picture*/}
            <Image
              src={user?.profile_picture ? imgSrcProfilePic : NoProfilePic}
              style={{ height: "80px", width: "80px", marginTop: "2px" }}
              roundedCircle
              fluid
            />
          </div>
        </div>

        <div className="mt-5 text-center">
          <h4 className="mb-3">{user?.user_name}</h4>

          {/* show the user's city and website (if it has any)  */}
          <Container>
            <Row>
              {user?.city && (
                <Col>
                  <div>
                    <h6 className="mb-0 fw-bold">City</h6>
                    <p>{user?.city}</p>
                  </div>
                </Col>
              )}

              {user?.website && (
                <Col>
                  <div>
                    <h6 className="mb-0 fw-bold">Website</h6>
                    <p>{user?.website} </p>
                  </div>
                </Col>
              )}
            </Row>
          </Container>

          {currentUser?.user_id === user.user_id ? (
            // show 'edit account' button if the id of the user from the url is the id of the user making the request
            <Button
              className="rounded mb-4"
              onClick={handleGoToEditAccountPage}
            >
              Edit Account
            </Button>
          ) : (
            <>
              {/* show 'follow' button if the id of the user from the url is the
              id of a different user */}
              <Button
                className="rounded mb-4"
                onClick={handleFollowAndUnfollow}
              >
                {/*  show 'follow' text if the user is not already followed, else show different text */}
                {relationship?.follower_user_id ===
                (currentUser?.user_id as string)
                  ? "Following. Click to Unfollow"
                  : "Follow"}
              </Button>
              {createAndDeleteRelationshipError && (
                <AxiosBaseError error={createAndDeleteRelationshipError} />
              )}
            </>
          )}
        </div>
      </Card>
    </Container>
  );
}

export default ProfileComponent;
