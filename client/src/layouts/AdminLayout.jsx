import { Navigate, Outlet } from "react-router-dom";
import SidebarAdmin from "../components/Admin/SidebarAdmin";

export default function AdminLayout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="d-flex">
      <SidebarAdmin />
      <div className="overflow-y-auto flex-grow-1 flex-shrink-1 w-100">
        <Outlet />
      </div>
    </div>
  );
}
