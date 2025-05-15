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
import { getCurrentUser, getUserById, getUsers } from "./services/userService";
import UpdateUser from "./pages/Admin/UpdateUser";
import {
  getRoomById,
  getRooms,
  getRoomsCurrentUser,
} from "./services/roomService";
import { getServiceById, getServices } from "./services/serviceService";
import ListPayment from "./pages/Admin/ListPayment";
import UpdateContract from "./pages/Admin/UpdateContract";
import { getContractById, getContracts } from "./services/contractService";
import ProfileLayout from "./layouts/ProfileLayout";
import Rooms from "./pages/Profile/Rooms";
import Bills from "./pages/Profile/Bills";
import CreateNewContract from "./pages/Admin/CreateNewContract";
import Maintenances from "./pages/Profile/Maintenances";
import { getAnalyst, getReport } from "./services/analystService";
import {
  getBillById,
  getBills,
  getBillsCurrentUser,
} from "./services/billService";
import {
  getMaintenanceById,
  getMaintenances,
  getMaintenancesByCurrentUser,
} from "./services/maintenancesService";
import { getPaymentById, getPayments } from "./services/paymentService";
import BillDetail from "./pages/Admin/BillDetail";
import UpdateBill from "./pages/Admin/UpdateBill";
import CreateNewBill from "./pages/Admin/CreateNewBill";
import UpdatePayment from "./pages/Admin/UpdatePayment";
import NotFound from "./pages/NotFound";
import UpdateMaintenance from "./pages/Admin/UpdateMaintenance";

const options = { page: 1, limit: 8 };

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <HomeLayout />,
        loader: async () => {
          if (
            localStorage.getItem("token") ||
            localStorage.getItem("refreshToken")
          ) {
            const user = await getCurrentUser();
            return user;
          }
          return null;
        },
        children: [
          { index: true, element: <Home /> },
          {
            path: "profile",
            element: <ProfileLayout />,
            loader: async () => {
              const user = await getCurrentUser();
              return user;
            },
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
                loader: async () => {
                  try {
                    const data = await getRoomsCurrentUser(options);
                    return data;
                  } catch (error) {
                    console.log(error);
                  }
                },
              },
              {
                path: "bills",
                element: <Bills />,
                loader: async () => {
                  try {
                    const data = await getBillsCurrentUser(options);
                    return data;
                  } catch (error) {
                    console.log(error);
                  }
                },
              },
              {
                path: "maintenances",
                element: <Maintenances />,
                loader: async () => {
                  try {
                    const data = await getMaintenancesByCurrentUser(options);
                    return data;
                  } catch (error) {
                    console.log(error);
                  }
                },
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
          {
            index: true,
            element: <Dashboard />,
            loader: async () => {
              try {
                const [analyst, roomData] = await Promise.all([
                  getAnalyst(),
                  getRooms(options),
                ]);
                return { analyst, roomData };
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "list-room",
            element: <ListRoom />,
            loader: async () => {
              try {
                const data = await getRooms(options);
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "list-tenant",
            element: <ListTenant />,
            loader: async () => {
              try {
                const data = await getUsers({ ...options, role: "tenant" });
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "list-service",
            element: <ListService />,
            loader: async () => {
              try {
                const data = await getServices({});
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "list-contract",
            element: <ListContract />,
            loader: async () => {
              try {
                const data = await getContracts(options);
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "list-bill",
            element: <ListBill />,
            loader: async () => {
              try {
                const data = await getBills(options);
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "list-maintenances",
            element: <ListMaintenances />,
            loader: async () => {
              try {
                const data = await getMaintenances(options);
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "list-payment",
            element: <ListPayment />,
            loader: async () => {
              try {
                const data = await getPayments(options);
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "report",
            element: <Report />,
            loader: async () => {
              try {
                const [report, bills] = await Promise.all([
                  getReport(),
                  getBills(),
                ]);

                return { report, initialBills: bills };
              } catch (error) {
                return null;
              }
            },
          },
          {
            path: "list-user",
            element: <ListUser />,
            loader: async () => {
              try {
                const data = await getUsers(options);
                return data;
              } catch (error) {
                console.log(error);
              }
            },
          },
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
          {
            path: "update-tenant/:id",
            element: <UpdateTenant />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const user = await getUserById(id);
                return user;
              } catch (error) {
                return null;
              }
            },
          },
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
                console.log(contract);
                return contract;
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "update-bill/:id",
            element: <UpdateBill />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const bill = await getBillById(id);
                return bill;
              } catch (error) {
                return null;
              }
            },
          },
          {
            path: "update-payment/:id",
            element: <UpdatePayment />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const payment = await getPaymentById(id);
                return payment;
              } catch (error) {
                return null;
              }
            },
          },

          {
            path: "update-maintenance/:id",
            element: <UpdateMaintenance />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const maintenance = await getMaintenanceById(id);
                return maintenance;
              } catch (error) {
                return null;
              }
            },
          },
          { path: "create-new-service", element: <CreateNewService /> },
          { path: "create-new-tenant", element: <CreateNewTenant /> },
          {
            path: "create-new-contract",
            element: <CreateNewContract />,
            loader: async () => {
              try {
                const [rooms, users] = await Promise.all([
                  getRooms({
                    status: "available",
                  }),
                  getUsers({ role: "tenant" }),
                ]);
                return { rooms, users };
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            path: "create-new-bill",
            element: <CreateNewBill />,
            loader: async () => {
              try {
                const [contracts, services] = await Promise.all([
                  getContracts({ status: "active" }),
                  getServices({ type: "other", order: "id:asc" }),
                ]);
                return { contracts, services };
              } catch (error) {
                return [];
              }
            },
          },
          { path: "create-new-user", element: <CreateNewUser /> },
          {
            path: "bill/:id",
            element: <BillDetail />,
            loader: async ({ params }) => {
              const { id } = params;
              try {
                const bill = await getBillById(id);
                return bill;
              } catch (error) {
                return null;
              }
            },
          },
        ],
      },
      { path: "logout", element: <Logout /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
