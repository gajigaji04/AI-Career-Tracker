import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layouts/RootLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";
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
    errorElement: <NotFoundPage />,
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
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
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
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
