import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserShield,
  FaUserCircle,
} from "react-icons/fa";
import { Navbar, Nav, Button, Container, NavDropdown } from "react-bootstrap";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const user = useLoaderData();
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const pathname = useLocation().pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScroll({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      bg={scroll.y > 0 || pathname !== "/" ? "dark" : "transparent"}
      data-bs-theme="dark"
      fixed="top"
    >
      <Container>
        {/* Navbar Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center lh-1">
          <FaHome size={30} className="me-2" />
          <span>Phòng trọ NBD</span>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto"></Nav>
          <Nav>
            {!user && (
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

            {user && (
              <NavDropdown title={user.full_name} id="collapsible-nav-dropdown">
                {user.role !== "tenant" && (
                  <Link
                    to="/admin"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <FaUserShield size={20} className="me-2" /> Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="dropdown-item d-flex align-items-center"
                >
                  <FaUserCircle size={20} className="me-2" /> Hồ sơ
                </Link>
                <NavDropdown.Divider />
                <Link
                  to="/logout"
                  className="dropdown-item d-flex align-items-center"
                >
                  <FaSignOutAlt size={20} className="me-2" /> Đăng xuất
                </Link>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
