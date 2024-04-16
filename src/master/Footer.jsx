import {Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const Footer = () => (
    <footer className="position-sticky bottom-0 bg-primary display-6 ">
      <Navbar className="justify-content-center d-flex pt-1" data-bs-theme="dark">
          <Nav className="flex-grow-1 justify-content-evenly">
            <LinkContainer to="/availability">
              <Nav.Link><i className="fa-regular fa-calendar-check"></i></Nav.Link>
            </LinkContainer>
            <LinkContainer to="/events">
              <Nav.Link><i className="fa-solid fa-clipboard-list"></i></Nav.Link>
            </LinkContainer>
            <LinkContainer to="/profile">
              <Nav.Link><i className="fa-regular fa-user"></i></Nav.Link>
            </LinkContainer>
          </Nav>
      </Navbar>
    </footer>
);

export default Footer;