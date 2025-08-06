// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Dashboard from "../pages/Dashboard";
import About from "../pages/public/About";
import MainLayout from "../layout/MainLayout";
import UserPage from "../pages/management/UserPage";
import EventPage from "../pages/management/EventPage";
import Middleware from "./middleware";

import Role from "../pages/management/settings/RolePage";
import NoPermission from "../pages/public/NoPermission";
import Mylist from "../pages/MyList";
import QRScannerPage from "../pages/QRScannerPage";
import ProfilePage from "../pages/ProfilePage";
import EventList from "../pages/EventList";
import RequestRegistration from "../pages/management/RequestRegistration";
import ForgotPassword from "../pages/public/ForgotPassword";
// Public route definitions (no need to wrap manually)
const publicRoutes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  // { path: "/about", component: About },
    { path: "/forget-password", component: ForgotPassword },
];

// Private route definitions (will be wrapped in MainLayout)
const privateRoutes = [
  { path: "/dashboard", component: Dashboard, rule: "view_dashboard" },
  { path: "/users", component: UserPage, rule: "view_users" },
  { path: "/events", component: EventPage, rule: "view_events" },
    { path: "/request-registration", component: RequestRegistration },
  { path: "/settings/role", component: Role, rule: "view_roles" },
  { path: "/list", component: EventList },
  { path: "/my-list", component: Mylist },
  { path: "/qrcode", component: QRScannerPage },
   {path: "/profile", component: ProfilePage}
];


// Combine and wrap routes with Middleware
const allRoutes = [
  ...publicRoutes.map(route => ({
    path: route.path,
    element: <Middleware element={<route.component />} isPublic />,
  })),
  ...privateRoutes.map(route => ({
    path: route.path,
    element: (
      <Middleware
        element={
          <MainLayout>
            <route.component />
          </MainLayout>
        }
        rule={route.rule}
      />
    ),
  })),

  {
    path: "/no-permission",
    element: <NoPermission />,
  },
];

// Create and export router
const router = createBrowserRouter(allRoutes);
export default router;
