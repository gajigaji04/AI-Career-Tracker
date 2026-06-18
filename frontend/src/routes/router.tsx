import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import StudiesPage from "../pages/StudiesPage";
import ProjectsPage from "../pages/ProjectsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/studies",
    element: <StudiesPage />,
  },
  {
    path: "/projects",
    element: <ProjectsPage />,
  },
]);
