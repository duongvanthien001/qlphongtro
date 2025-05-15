import React from "react";
import { Dropdown, Nav, Navbar } from "react-bootstrap";
import {
  FaChartLine,
  FaDollarSign,
  FaFileContract,
  FaFileInvoice,
  FaHome,
  FaHouseUser,
  FaServicestack,
  FaSignOutAlt,
  FaUserAlt,
  FaUsers,
  FaWrench,
} from "react-icons/fa";
import { FcHome } from "react-icons/fc";
import { Link, useLoaderData } from "react-router-dom";
import clsx from "clsx";

const menus = [
  {
    to: "/admin",
    icon: <FaHome />,
    title: "Trang chủ",
  },
  {
    to: "/admin/list-room",
    icon: <FaHouseUser />,
    title: "Phòng",
  },
  {
    to: "/admin/list-user",
    icon: <FaUsers />,
    title: "Người dùng",
  },
  {
    to: "/admin/list-service",
    icon: <FaServicestack />,
    title: "Dịch vụ",
  },
  {
    to: "/admin/list-tenant",
    icon: <FaUserAlt />,
    title: "Người thuê trọ",
  },
  {
    to: "/admin/list-contract",
    icon: <FaFileContract />,
    title: "Hợp đồng",
  },
  {
    to: "/admin/list-bill",
    icon: <FaFileInvoice />,
    title: "Hóa đơn",
  },
  {
    to: "/admin/list-payment",
    icon: <FaDollarSign />,
    title: "Thanh toán",
  },
  {
    to: "/admin/report",
    icon: <FaChartLine />,
    title: "Báo cáo",
  },
  {
    to: "/admin/list-maintenances",
    icon: <FaWrench />,
    title: "Bảo trì",
  },
  {
    to: "/logout",
    icon: <FaSignOutAlt />,
    title: "Đăng xuất",
  },
];

export default function SidebarAdmin({ isOpen, onClose }) {
  const user = useLoaderData();

  return (
    <div
      className={clsx("sidebar-admin-container", isOpen && "active")}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark d-print-none h-100 sidebar-admin"
        style={{ flex: "0 0 250px", width: "250px" }}
      >
        <Navbar variant="dark" className="flex-column mb-auto">
          <Navbar.Brand
            href="/admin"
            className="text-center mb-4 d-flex align-items-center gap-2"
          >
            <FcHome />
            <span>Phòng trọ NBD</span>
          </Navbar.Brand>

          <Nav className="flex-column w-100">
            {menus.map((menu, i) => {
              if (menu.to === "/admin/report" && user.role !== "admin") {
                return null;
              }

              if (menu.to === "/admin/list-user" && user.role !== "admin") {
                return null;
              }
              return (
                <Nav.Item
                  className={clsx("w-100", menus.length - 1 !== i && "mb-2")}
                  key={menu.to}
                >
                  <Link
                    to={menu.to}
                    className="nav-link text-white d-flex align-items-center gap-2"
                  >
                    {menu.icon} {menu.title}
                  </Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </Navbar>
        <Dropdown>
          <Dropdown.Toggle
            variant="link"
            className="d-flex align-items-center gap-2 p-2 text-white w-100 text-start text-decoration-none"
          >
            <FaUserAlt /> {user?.full_name}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Link to="/logout" className="dropdown-item">
              <FaSignOutAlt /> Đăng xuất
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
