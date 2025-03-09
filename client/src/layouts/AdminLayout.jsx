import { Navigate, Outlet, useLoaderData, useLocation } from "react-router-dom";
import SidebarAdmin from "../components/Admin/SidebarAdmin";

export default function AdminLayout() {
  const user = useLoaderData();
  const pathname = useLocation().pathname;

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
      <SidebarAdmin />
      <div className="overflow-y-auto flex-grow-1 flex-shrink-1 w-100">
        <Outlet />
      </div>
    </div>
  );
}
