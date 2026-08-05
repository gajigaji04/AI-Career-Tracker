import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layouts/RootLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import StudiesPage from "../pages/StudiesPage";
import ProjectsPage from "../pages/ProjectsPage";
import ApplicationsPage from "../pages/ApplicationsPage";
import AIPage from "../pages/AIPage";
import ResumePage from "../pages/ResumePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "studies", element: <StudiesPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "applications", element: <ApplicationsPage /> },
      { path: "ai", element: <AIPage /> },
      { path: "resumes", element: <ResumePage /> },
    ],
  },
]);
