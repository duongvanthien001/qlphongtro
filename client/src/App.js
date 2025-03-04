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
import ListContract from "./pages/Admin/ListContract";
import Logout from "./pages/Logout";
import ListService from "./pages/Admin/ListService";
import CreateNewService from "./pages/Admin/CreateNewService";
import UpdateService from "./pages/Admin/UpdateService";
import Profile from "./pages/Profile/Profile";
import ListMaintenances from "./pages/Admin/ListMaintenances";
import HomeLayout from "./layouts/HomeLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getCurrentUser, getUserById } from "./services/userService";
import UpdateUser from "./pages/Admin/UpdateUser";
import { getRoomById } from "./services/roomService";
import { getServiceById } from "./services/serviceService";
import ListPayment from "./pages/Admin/ListPayment";
import UpdateContract from "./pages/Admin/UpdateContract";
import { getContractById } from "./services/contractService";
import ProfileLayout from "./layouts/ProfileLayout";
import Rooms from "./pages/Profile/Rooms";
import Bills from "./pages/Profile/Bills";
import Maintenances from "./pages/Profile/Maintenances";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <HomeLayout />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "profile",
            element: <ProfileLayout />,
            children: [
              {
                index: true,
                element: <Profile />,
                loader: async () => {
                  const user = await getCurrentUser();
                  return user;
                },
              },
              {
                path: "rooms",
                element: <Rooms />,
              },
              {
                path: "bills",
                element: <Bills />,
              },
              {
                path: "maintenances",
                element: <Maintenances />,
              },
            ],
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        loader: async () => {
          const user = await getCurrentUser();
          return user;
        },
        children: [
          { index: true, element: <Dashboard /> },
          { path: "list-room", element: <ListRoom /> },
          { path: "list-tenant", element: <ListTenant /> },
          { path: "list-service", element: <ListService /> },
          { path: "list-contract", element: <ListContract /> },
          { path: "list-invoice", element: <ListBill /> },
          { path: "list-maintenances", element: <ListMaintenances /> },
          { path: "list-payment", element: <ListPayment /> },
          { path: "report", element: <Report /> },
          { path: "list-user", element: <ListUser /> },
          { path: "create-new-room", element: <CreateNewRoom /> },
          {
            path: "update-room/:id",
            element: <UpdateRoom />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const room = await getRoomById(id);
                return room;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "update-user/:id",
            element: <UpdateUser />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const user = await getUserById(id);
                return user;
              } catch (error) {
                console.log(error);
              }
            },
          },
          { path: "update-tenant", element: <UpdateTenant /> },
          {
            path: "update-service/:id",
            element: <UpdateService />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const service = await getServiceById(id);
                return service;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "update-contract/:id",
            element: <UpdateContract />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const contract = await getContractById(id);
                return contract;
              } catch (error) {
                console.log(error);
              }
            },
          },
          { path: "create-new-service", element: <CreateNewService /> },
          { path: "create-new-tenant", element: <CreateNewTenant /> },
          { path: "add-user", element: <CreateNewUser /> },
        ],
      },
      { path: "logout", element: <Logout /> },
      { path: "*", element: <h1>Not Found</h1> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
