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

            {/* Main routes - авторизация отключена, но API работает */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              }
            />

            <Route
              path="/programs"
              element={
                <AppLayout>
                  <ProgramsListPage />
                </AppLayout>
              }
            />
            
            <Route
              path="/programs/constructor"
              element={
                <AppLayout>
                  <ProgramConstructorPage />
                </AppLayout>
              }
            />

            <Route
              path="/expertise"
              element={
                <AppLayout>
                  <ExpertisePage />
                </AppLayout>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AppLayout>
                  <AdminUsersPage />
                </AppLayout>
              }
            />

            <Route
              path="/profile"
              element={
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
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
