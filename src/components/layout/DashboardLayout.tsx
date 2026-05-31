import { Outlet, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

export function DashboardLayout() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b px-6 py-4 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2 font-semibold text-lg'>
          <Building2 className='h-5 w-5 text-blue-600' />
          Admin Dashboard
        </Link>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-600'>{user?.email}</span>
          <Button variant='outline' size='sm' onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>
      <main className='max-w-5xl mx-auto p-6'>
        <Outlet />
      </main>
    </div>
  );
}