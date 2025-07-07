// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import MainLayout from "../layout/MainLayout";
import UserPage from "../pages/UserPage";
import EventPage from "../pages/EventPage";
import Middleware from "./middleware";

import ListPage from "../pages/ListPage";
import Role from "../pages/Role";
import NoPermission from "../pages/NoPermission";
import Mylist from "../pages/MyList";
// Public route definitions (no need to wrap manually)
const publicRoutes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/about", component: About },
];

// Private route definitions (will be wrapped in MainLayout)
const privateRoutes = [
  { path: "/dashboard", component: Dashboard, rule: "view_dashboard" },
  { path: "/users", component: UserPage, rule: "view_users" },
  { path: "/events", component: EventPage, rule: "view_events" },
  { path: "/settings/role", component: Role, rule: "view_roles" },
  { path: "/list", component: ListPage },
   { path: "/my-list", component: Mylist },

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
