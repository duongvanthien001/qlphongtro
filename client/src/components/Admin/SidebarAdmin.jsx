import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import {
  FaChartLine,
  FaFileInvoice,
  FaHome,
  FaHouseUser,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function SidebarAdmin() {
  return (
    <div
      className="bg-dark text-white p-3 vh-100"
      style={{ flex: "0 0 250px" }}
    >
      <Navbar variant="dark" className="flex-column">
        <Navbar.Brand href="/admin" className="text-center mb-4">
          <span>
            <FcHome /> Phòng trọ 24h
          </span>
        </Navbar.Brand>

        <Nav className="flex-column w-100">
          <Nav.Item className="w-100">
            <Link
              to="/admin"
              className="nav-link text-white d-flex align-items-center mb-2 gap-2"
            >
              <FaHome /> Trang chủ
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100">
            <Link
              to="/admin/list-room"
              className="nav-link text-white d-flex align-items-center mb-2 gap-2"
            >
              <FaHouseUser /> Quản lý phòng
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100">
            <Link
              to="/admin/list-tenant"
              className="nav-link text-white d-flex align-items-center mb-2 gap-2"
            >
              <FaUserAlt /> Người thuê trọ
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100">
            <Link
              to="/admin/list-invoice"
              className="nav-link text-white d-flex align-items-center mb-2 gap-2"
            >
              <FaFileInvoice /> Hóa đơn
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100">
            <Link
              to="/admin/report"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaChartLine /> Báo cáo
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100">
            <Link
              to="/admin/list-user"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaUsers /> Quản lý người dùng
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </div>
  );
}
