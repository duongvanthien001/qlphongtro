import React from "react";
import { Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function SidebarProfile() {
  const pathname = useLocation().pathname;

  return (
    <Col md={3}>
      <ListGroup as={"ul"}>
        <ListGroupItem as={"button"} action active={pathname === "/profile"}>
          <Link to="/profile" className="text-decoration-none text-inherit">
            Thông tin cá nhân
          </Link>
        </ListGroupItem>
        <ListGroupItem
          as={"button"}
          action
          active={pathname === "/profile/rooms"}
        >
          <Link
            to="/profile/rooms"
            className="text-decoration-none text-inherit"
          >
            Phòng của tôi
          </Link>
        </ListGroupItem>
        <ListGroupItem
          as={"button"}
          action
          active={pathname === "/profile/bills"}
        >
          <Link
            to="/profile/bills"
            className="text-decoration-none text-inherit"
          >
            Hóa đơn
          </Link>
        </ListGroupItem>
        <ListGroupItem
          as={"button"}
          action
          active={pathname === "/profile/maintenances"}
        >
          <Link
            to="/profile/maintenances"
            className="text-decoration-none text-inherit"
          >
            Bảo trì
          </Link>
        </ListGroupItem>
        <ListGroupItem as={"button"} action>
          <Link to="/logout" className="text-decoration-none text-inherit">
            Đăng xuất
          </Link>
        </ListGroupItem>
      </ListGroup>
    </Col>
  );
}
