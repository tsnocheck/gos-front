import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Spin } from "antd";
import ruRU from "antd/locale/ru_RU";
import { Suspense, lazy, type JSX } from "react";
import { UserRole } from "./types";

// Components
import { AppLayout } from "./components/AppLayout";

// Lazy loaded pages
const LoginPage = lazy(() => import("./pages/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then(module => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(module => ({ default: module.DashboardPage })));
const ProgramsListPage = lazy(() => import("./pages/ProgramsListPage").then(module => ({ default: module.ProgramsListPage })));
const ExpertisePage = lazy(() => import("./pages/ExpertisePage").then(module => ({ default: module.ExpertisePage })));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage").then(module => ({ default: module.AdminUsersPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(module => ({ default: module.ProfilePage })));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute.tsx").then(module => ({ default: module.ProtectedRoute })));
const AdminArchivePage = lazy(() => import("./pages/AdminArchivePage.tsx").then(module => ({ default: module.AdminArchivePage })));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.tsx").then(module => ({ default: module.ResetPasswordPage })));
const AdminDictionariesPage = lazy(() => import("./pages/AdminDictionariesPage").then(module => ({ default: module.AdminDictionariesPage })));
const AdminExpertReplacePage = lazy(() => import("./pages/AdminExpertReplacePage").then(module => ({ default: module.AdminExpertReplacePage })));
const AdminProgramsPage = lazy(() => import("./pages/AdminProgramsPage.tsx").then(module => ({ default: module.AdminProgramsPage })));
const AdminCandidatesPage = lazy(() => import("./pages/AdminCandidatesPage.tsx").then(module => ({ default: module.AdminCandidatesPage })));
const AdminRecommendationsPage = lazy(() => import("./pages/AdminRecommendationsPage.tsx"));
const ProgramsConstructorPage = lazy(() => import("./pages/ProgramsConstructorPage.tsx"));

// Loading component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
    }}
  >
    <Spin size="large" />
    <div style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
      Загрузка страницы...
    </div>
  </div>
);

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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {generateRoutes(routes)}
            </Routes>
          </Suspense>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
