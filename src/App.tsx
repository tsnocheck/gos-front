import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";

// Components
import { AppLayout } from "./components/AppLayout";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProgramsListPage } from "./pages/ProgramsListPage";
import { ExpertisePage } from "./pages/ExpertisePage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AdminArchivePage } from "./pages/AdminArchivePage.tsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.tsx";
import { AdminDictionariesPage } from "./pages/AdminDictionariesPage";
import { AdminExpertReplacePage } from "./pages/AdminExpertReplacePage";
import type { JSX } from "react";
import { UserRole } from "./types";
import { AdminProgramsPage } from "./pages/AdminProgramsPage.tsx";
import { AdminCandidatesPage } from "./pages/AdminCandidatesPage.tsx";
import AdminRecommendationsPage from "./pages/AdminRecommendationsPage.tsx";
import ProgramsConstructorPage from "./pages/ProgramsConstructorPage.tsx";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
    mutations: {
      retry: 1,
    },
  },
});

interface TRoute {
  path: string;
  element: JSX.Element;
  layout?: boolean;
  protected?: boolean;
  requiredRoles?: UserRole[];
}

const routes: TRoute[] = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    protected: true,
    layout: true,
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/auth/reset-password", element: <ResetPasswordPage /> },
  {
    path: "/programs",
    element: <ProgramsListPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.AUTHOR]
  },
  {
    path: "/programs/constructor",
    element: <ProgramsConstructorPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.AUTHOR]
  },
  {
    path: "/programs/constructor/:id",
    element: <ProgramsConstructorPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.AUTHOR]
  },
  {
    path: "/expertise",
    element: <ExpertisePage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.EXPERT]
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.ADMIN]
  },
  {
    path: "/admin/users/archive",
    element: <AdminArchivePage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.ADMIN]
  },
  {
    path: "/admin/dictionaries",
    element: <AdminDictionariesPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.ADMIN]
  },
  {
    path: "/admin/replace-expert",
    element: <AdminExpertReplacePage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.ADMIN]
  },
  {
    path: "/admin/programs",
    element: <AdminProgramsPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.ADMIN]
  },
  {
    path: "/admin/candidates",
    element: <AdminCandidatesPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.ADMIN]
  },
  {
    path: "/admin/recommendations",
    element: <AdminRecommendationsPage />,
    protected: true,
    layout: true,
    requiredRoles: [UserRole.ADMIN]
  },
  { path: "/profile", element: <ProfilePage />, protected: true, layout: true },
  {
    path: "/*",
    element: (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <h1>404 - Страница не найдена</h1>
        <a href="/dashboard">Вернуться на главную</a>
      </div>
    ),
  },
];

const generateRoutes = (routes: TRoute[]): React.ReactNode => {
  return routes.map((route) => {
    let element = route.element;

    if (route.layout) {
      element = <AppLayout>{element}</AppLayout>;
    }
    if (route.protected) {
      element = (
        <ProtectedRoute requiredRoles={route.requiredRoles ?? undefined}>
          {element}
        </ProtectedRoute>
      );
    }

    return <Route key={route.path} path={route.path} element={element} />;
  });
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ruRU}>
        <Router>
          <Routes>
            {generateRoutes(routes)}
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
