import React from "react";
import { Col, ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

export default function SidebarProfile() {
  const pathname = useLocation().pathname;

  return (
    <Col md={3}>
      <ListGroup as={"ul"}>
        <Link
          to="/profile"
          className={clsx(
            "text-decoration-none list-group-item list-group-item-action",
            pathname === "/profile" && "active"
          )}
        >
          Thông tin cá nhân
        </Link>
        <Link
          to="/profile/rooms"
          className={clsx(
            "text-decoration-none list-group-item list-group-item-action",
            pathname === "/profile/rooms" && "active"
          )}
        >
          Phòng của tôi
        </Link>
        <Link
          to="/profile/bills"
          className={clsx(
            "text-decoration-none list-group-item list-group-item-action",
            pathname === "/profile/bills" && "active"
          )}
        >
          Hóa đơn
        </Link>
        <Link
          to="/profile/maintenances"
          className={clsx(
            "text-decoration-none list-group-item list-group-item-action",
            pathname === "/profile/maintenances" && "active"
          )}
        >
          Bảo trì
        </Link>

        <Link
          to="/logout"
          className="text-decoration-none list-group-item list-group-item-action"
        >
          Đăng xuất
        </Link>
      </ListGroup>
    </Col>
  );
}
