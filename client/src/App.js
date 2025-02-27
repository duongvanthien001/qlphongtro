import { Routes, Route, BrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ListRoom from "./pages/Admin/ListRoom";
import ListTenant from "./pages/Admin/ListTenant";
import Report from "./pages/Admin/Report";
import ListBill from "./pages/Admin/ListBill";
import UpdateRoom from "./pages/Admin/UpdateRoom";
import UpdateTenant from "./pages/Admin/UpdateTenant";
import CreateNewTenant from "./pages/Admin/CreateNewTenant";
import CreateNewRoom from "./pages/Admin/CreateNewRoom";
import ListUser from "./pages/Admin/ListUser";
import CreateNewUser from "./pages/Admin/CreateNewUser";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="list-room" element={<ListRoom />} />
          <Route path="list-tenant" element={<ListTenant />} />
          <Route path="list-invoice" element={<ListBill />} />
          <Route path="report" element={<Report />} />
          <Route path="list-user" element={<ListUser />} />
          <Route path="create-new-room" element={<CreateNewRoom />} />
          <Route path="update-room/:id" element={<UpdateRoom />} />
          <Route path="update-tenant" element={<UpdateTenant />} />
          <Route path="create-new-tenant" element={<CreateNewTenant />} />
          <Route path="add-user" element={<CreateNewUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
