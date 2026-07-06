import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "../components/layouts/RootLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import StudiesPage from "../pages/StudiesPage";
import ProjectsPage from "../pages/ProjectsPage";
import ApplicationsPage from "../pages/ApplicationsPage";
import AIPage from "../pages/AIPage";
import ResumePage from "../pages/ResumePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "studies", element: <StudiesPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "applications", element: <ApplicationsPage /> },
      { path: "ai", element: <AIPage /> },
      { path: "resumes", element: <ResumePage /> },
    ],
  },
]);
