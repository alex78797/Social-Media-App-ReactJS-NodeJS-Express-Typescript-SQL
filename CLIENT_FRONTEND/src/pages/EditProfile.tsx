import EditProfileForm from "../components/EditProfileForm";
import { useAppSelector } from "../app/hooks";

/**
 *
 * @returns A page. where the user can edit its profile.
 */
function EditProfile() {
  // get the current user / the user making the request from the global state
  const currentUser = useAppSelector((state) => state.auth.user);
  // add '!' to please typescript: Type 'IUser | null' is not assignable to type 'IUser'.
  return <EditProfileForm user={currentUser!} />;
}

export default EditProfile;
