import {
  Link,
  Navigate,
  Outlet,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import SidebarAdmin from "../components/Admin/SidebarAdmin";
import { useState } from "react";
import { FcHome } from "react-icons/fc";

export default function AdminLayout() {
  const user = useLoaderData();
  const pathname = useLocation().pathname;
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === "tenant") {
    return <Navigate to="/" />;
  }

  if (user.role !== "admin" && pathname === "/admin/list-user") {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="d-flex vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top z-1 d-lg-none">
        <div className="container-fluid">
          <Link
            className="navbar-brand d-flex align-items-center "
            href="/admin"
          >
            <FcHome />
            <span className="ms-2">Phòng trọ NBD</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpenSidebar(!isOpenSidebar)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      <SidebarAdmin
        isOpen={isOpenSidebar}
        onClose={() => setIsOpenSidebar(false)}
      />
      <div className="overflow-y-auto flex-grow-1 flex-shrink-1 w-100 admin-content pt-lg-0">
        <Outlet />
      </div>
    </div>
  );
}
