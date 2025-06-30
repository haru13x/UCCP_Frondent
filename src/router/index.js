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
// Public route definitions (no need to wrap manually)
const publicRoutes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/about", component: About },
];

// Private route definitions (will be wrapped in MainLayout)
const privateRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/users", component: UserPage },
  { path: "/events", component: EventPage },

  { path: "/list", component: ListPage },
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
      />
    ),
  })),
];

// Create and export router
const router = createBrowserRouter(allRoutes);
export default router;
