import {Outlet} from "react-router-dom";
import Header from "../master/Header";
import Footer from "../master/Footer";
import Container from "react-bootstrap/Container";

const Layout = () => (
    <>
      <Header/>
      <Container className="flex-grow-1 d-flex flex-column justify-content-between">
        <main className="mt-4 d-flex flex-grow-1 flex-column">
          <Outlet/>
        </main>
      </Container>
      <Footer/>
    </>
);

export default Layout;