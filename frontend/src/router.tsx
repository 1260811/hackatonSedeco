import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import AccountsPage from '@/pages/AccountsPage';
import TandasPage from '@/pages/TandasPage';
import TandaDetailPage from '@/pages/TandaDetailPage';
import AgreementsPage from '@/pages/AgreementsPage';
import AgreementPage from '@/pages/agreements/AgreementPage';
import ObligationsPage from '@/pages/ObligationsPage';
import PaymentPage from '@/pages/obligations/PaymentPage';
import HistoryPage from '@/pages/HistoryPage';
import NotificationsPage from '@/pages/NotificationsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/accounts', element: <AccountsPage /> },
          { path: '/tandas', element: <TandasPage /> },
          { path: '/tandas/:tandaId', element: <TandaDetailPage /> },
          { path: '/tandas/:tandaId/agreement', element: <AgreementPage /> },
          { path: '/agreements', element: <AgreementsPage /> },
          { path: '/obligations', element: <ObligationsPage /> },
          { path: '/obligations/:obligationId', element: <PaymentPage /> },
          { path: '/history', element: <HistoryPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
        ],
      },
    ],
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> },
]);
