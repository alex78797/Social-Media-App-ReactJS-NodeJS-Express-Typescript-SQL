import { useLocation } from "react-router-dom";
import { useGetUserQuery } from "../features/users/usersApiSlice";
import ProfileComponent from "../components/ProfileComponent";
import Loading from "../components/Loading";
import AxiosBaseError from "../components/AxiosBaseError";

/**
 *
 * @returns Component / page which displays the user's properties (profile picture, cover picture, city, website)
 */
function Profile() {
  // get the id of the user from the url
  const user_id = useLocation().pathname.split("/")[2];

  // use the 'useGetRelationshipQuery'
  const { data: user, isLoading, error: userError } = useGetUserQuery(user_id);

  // show this container if an error occured while retreiving the user from the database
  if (userError) {
    return <AxiosBaseError error={userError} />;
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  return <ProfileComponent user={user} />;
}

export default Profile;
