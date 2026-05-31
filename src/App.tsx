import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import DashboardPage from '@/pages/DashboardPage';
import OrgDetailPage from '@/pages/OrgDetailPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className='p-8'>Loading...</div>;
  if (!user) return <Navigate to='/signin' replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path='/signin' element={<SignInPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/' element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path='organizations/:id' element={<OrgDetailPage />} />
      </Route>
    </Routes>
  );
}