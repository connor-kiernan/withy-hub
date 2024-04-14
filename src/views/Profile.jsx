import {Button} from "react-bootstrap";
import {useSendLogoutMutation} from "../features/auth/authApiSlice";

const Profile = () => {
  const [logout] = useSendLogoutMutation();

  const sendLogout = async () => {
    await logout();

    window.location.reload();
  }

  return (
      <>
        <div className="text-center">
          <h1>Profile</h1>
        </div>
        <div className="flex-grow-1 d-flex flex-column mt-5">
          <Button onClick={() => sendLogout()}>Log Out</Button>
        </div>
      </>
  );
};

export default Profile;