// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard"
import About from "../pages/About";
import MainLayout from "../layout/MainLayout";
import UserPage from "../pages/UserPage";
import EventPage from "../pages/EventPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path : '/dashboard',
    element : <MainLayout><Dashboard /></MainLayout>
 
  },
   {
    path : '/users',
    element : <MainLayout><UserPage /></MainLayout>
 
  },
    {
    path : '/events',
    element : <MainLayout><EventPage /></MainLayout>
 
  },
  {
    path:'/about',
    element :<About />
  }
]);

export default router;
