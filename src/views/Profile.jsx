import {Button, Col, Row} from "react-bootstrap";
import {useSendLogoutMutation} from "../features/auth/authApiSlice";

const Profile = () => {
  const [logout] = useSendLogoutMutation();

  const sendLogout = async () => {
    await logout();

    window.location.href = `${process.env.REACT_APP_COGNITO_URL}/logout?client_id=56aos06b5upnvkhho12k6lcfa6&logout_uri=https%3A%2F%2Fwithingtonhopecf.auth.eu-west-1.amazoncognito.com%2Foauth2%2Fauthorize%3Fclient_id%3D56aos06b5upnvkhho12k6lcfa6%26response_type%3Dcode%26scope%3Demail%2Bopenid%2Bphone%2Bprofile%26redirect_uri%3Dhttps%253A%252F%252Fhub.withingtonhopecf.co.uk`;
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