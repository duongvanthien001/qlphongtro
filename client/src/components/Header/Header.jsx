import React from "react";
import {
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const token = localStorage.getItem("token");

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/">
          <FaHome size={30} /> {/* Logo icon */}
        </Navbar.Brand>

        {/* Navbar toggler for mobile responsiveness */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse className="justify-content-end w-100">
          <Nav>
            {!token && (
              <Nav.Item>
                <Link to="/login" className="text-decoration-none">
                  <Button
                    variant="outline-light"
                    className="d-flex align-items-center"
                  >
                    <FaSignInAlt size={20} />
                    <span>Đăng nhập</span>
                  </Button>
                </Link>
              </Nav.Item>
            )}

            {token && (
              <Nav.Item className="d-flex align-items-center">
                <Link to="/admin" className="me-4 text-decoration-none">
                  <Button
                    variant="outline-light"
                    className="d-flex align-items-center"
                  >
                    <FaUserShield size={20} />
                    <span>Admin</span>
                  </Button>
                </Link>

                <Link to="/logout" className="text-decoration-none">
                  <Button
                    variant="outline-light"
                    className="d-flex align-items-center"
                  >
                    <FaSignOutAlt size={20} />
                    <span>Đăng xuất</span>
                  </Button>
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
