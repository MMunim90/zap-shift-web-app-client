import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../pages/SendParcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import AboutUs from "../pages/AboutUs/AboutUs";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import BeARider from "../pages/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import Profile from "../pages/Dashboard/Profile/Profile";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import ManageAdmins from "../pages/Dashboard/MakeAdmin/ManageAdmins";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import PendingDeliveries from "../pages/Dashboard/PendingDeliveries/PendingDeliveries";
import RiderRoute from "../routes/RiderRoute";
import CompletedDeliveries from "../pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../pages/Dashboard/MyEarnings/MyEarnings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        Component: Coverage,
        loader: () => fetch("./warehouses.json"),
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
      },
      {
        path: "about",
        Component: AboutUs,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "/*",
        Component: ErrorPage,
      },
      {
        path: "beARider",
        element: <PrivateRoute>
          <BeARider></BeARider>
        </PrivateRoute>
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "home",
        Component: DashboardHome,
      },
      {
        path: "myParcels",
        Component: MyParcels,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "track/:trackingId",
        Component: TrackParcel,
      },

      // admin only route
      {
        path: "assignRider",
        element: <AdminRoute>
          <AssignRider></AssignRider>
        </AdminRoute>

      },
      {
        path: "pendingRiders",
        element: <AdminRoute>
          <PendingRiders></PendingRiders>
        </AdminRoute>

      },
      {
        path: "activeRiders",
        element: <AdminRoute>
          <ActiveRiders></ActiveRiders>
        </AdminRoute>
      },
      {
        path: "manageAdmin",
        element: <AdminRoute>
          <ManageAdmins></ManageAdmins>
        </AdminRoute>
      },

      //rider only route
      {
        path: "pendingDeliveries",
        element: 
        <RiderRoute>
          <PendingDeliveries></PendingDeliveries>
        </RiderRoute>
      },
      {
        path: "completedDeliveries",
        element: 
        <RiderRoute>
          <CompletedDeliveries></CompletedDeliveries>
        </RiderRoute>
      },
      {
        path: "myEarnings",
        element: 
        <RiderRoute>
          <MyEarnings></MyEarnings>
        </RiderRoute>
      },
    ],
  },
]);
