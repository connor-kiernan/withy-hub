import {Button, Col, Row} from "react-bootstrap";
import {useSendLogoutMutation} from "../features/auth/authApiSlice";

const Profile = () => {
  const [logout] = useSendLogoutMutation();

  const sendLogout = async () => {
    await logout();

    window.location.href = `${process.env.REACT_APP_COGNITO_URL}/logout?client_id=56aos06b5upnvkhho12k6lcfa6&logout_uri=${encodeURIComponent(process.env.REACT_APP_HOSTED_URL)}`;
  }

  return (
      <>
        <div className="text-center">
          <h1>Profile</h1>
        </div>
        <Row className="mt-5 justify-content-center">
          <Col xs={12} md={4}>
            <Button className="w-100" onClick={() => sendLogout()}>Log Out</Button>
          </Col>
        </Row>
      </>
  );
};

export default Profile;