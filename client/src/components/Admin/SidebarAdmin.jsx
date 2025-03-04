import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import {
  FaChartLine,
  FaFileContract,
  FaFileInvoice,
  FaHome,
  FaHouseUser,
  FaMoneyBill,
  FaServicestack,
  FaSignOutAlt,
  FaUserAlt,
  FaUsers,
  FaWrench,
} from "react-icons/fa";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function SidebarAdmin() {
  return (
    <div className="bg-dark text-white p-3 h-100" style={{ flex: "0 0 250px" }}>
      <Navbar variant="dark" className="flex-column">
        <Navbar.Brand href="/admin" className="text-center mb-4">
          <span>
            <FcHome /> Phòng trọ NBD
          </span>
        </Navbar.Brand>

        <Nav className="flex-column w-100">
          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaHome /> Trang chủ
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-room"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaHouseUser /> Phòng
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-user"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaUsers /> Người dùng
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-service"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaServicestack /> Dịch vụ
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-tenant"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaUserAlt /> Người thuê trọ
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-contract"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaFileContract /> Hợp đồng
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-invoice"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaFileInvoice /> Hóa đơn
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-payment"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaMoneyBill /> Thanh toán
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/report"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaChartLine /> Báo cáo
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100 mb-2">
            <Link
              to="/admin/list-maintenances"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaWrench /> Bảo trì
            </Link>
          </Nav.Item>

          <Nav.Item className="w-100">
            <Link
              to="/logout"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaSignOutAlt /> Đăng xuất
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </div>
  );
}
