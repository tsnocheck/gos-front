import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

// Components
import { AppLayout } from './components/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProgramConstructorPage } from './pages/ProgramConstructorPage';
import { ProgramsListPage } from './pages/ProgramsListPage';
import { ExpertisePage } from './pages/ExpertisePage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { ProfilePage } from './pages/ProfilePage';
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import {AdminArchivePage} from "./pages/AdminArchivePage.tsx";
import { ResetPasswordPage } from './pages/ResetPasswordPage.tsx';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ruRU}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={<LoginPage />} 
            />
            <Route 
              path="/register" 
              element={<RegisterPage />} 
            />

            <Route 
              path="/auth/reset-password" 
              element={<ResetPasswordPage />} 
            />

            {/* Main routes - авторизация отключена, но API работает */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/programs"
              element={
                  <ProtectedRoute>
                <AppLayout>
                  <ProgramsListPage />
                </AppLayout>
                  </ProtectedRoute>
              }
            />
            
            <Route
              path="/programs/constructor"
              element={
                  <ProtectedRoute>
                <AppLayout>
                  <ProgramConstructorPage />
                </AppLayout>
                  </ProtectedRoute>
              }
            />

            <Route
              path="/expertise"
              element={
                  <ProtectedRoute>
                        <AppLayout>
                          <ExpertisePage />
                        </AppLayout>
                  </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                  <ProtectedRoute>
                        <AppLayout>
                          <AdminUsersPage />
                        </AppLayout>
                  </ProtectedRoute>
              }
            />

              <Route
                  path="/admin/users/archive"
                  element={
                      <ProtectedRoute>
                      <AppLayout>
                          <AdminArchivePage />
                      </AppLayout>
                      </ProtectedRoute>
                  }
              />

            <Route
              path="/profile"
              element={
                  <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
                  </ProtectedRoute>
              }
            />

            {/* 404 page */}
            <Route
              path="*"
              element={
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  flexDirection: 'column'
                }}>
                  <h1>404 - Страница не найдена</h1>
                  <a href="/dashboard">Вернуться на главную</a>
                </div>
              }
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
