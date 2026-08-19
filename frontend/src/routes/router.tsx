import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layouts/RootLayout";
import Spinner from "../components/common/Spinner";
import NotFoundPage from "../pages/NotFoundPage";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const FindEmailPage = lazy(() => import("../pages/FindEmailPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const StudiesPage = lazy(() => import("../pages/StudiesPage"));
const ProjectsPage = lazy(() => import("../pages/ProjectsPage"));
const ApplicationsPage = lazy(() => import("../pages/ApplicationsPage"));
const AIPage = lazy(() => import("../pages/AIPage"));
const ResumePage = lazy(() => import("../pages/ResumePage"));

const PageFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100svh",
    }}
  >
    <Spinner size={28} />
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<LandingPage />),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/register",
    element: withSuspense(<RegisterPage />),
  },
  {
    path: "/forgot-password",
    element: withSuspense(<ForgotPasswordPage />),
  },
  {
    path: "/find-email",
    element: withSuspense(<FindEmailPage />),
  },
  {
    path: "/reset-password",
    element: withSuspense(<ResetPasswordPage />),
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      { path: "dashboard", element: withSuspense(<DashboardPage />) },
      { path: "studies", element: withSuspense(<StudiesPage />) },
      { path: "projects", element: withSuspense(<ProjectsPage />) },
      { path: "applications", element: withSuspense(<ApplicationsPage />) },
      { path: "ai", element: withSuspense(<AIPage />) },
      { path: "resumes", element: withSuspense(<ResumePage />) },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
