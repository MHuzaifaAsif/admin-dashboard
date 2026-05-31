import { Outlet, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Building2, LogOut, LayoutDashboard } from 'lucide-react';

export function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0f1a 100%)' }}>

      {/* Background blobs */}
      <div className='fixed top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none'
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className='fixed bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none'
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

      {/* Header */}
      <header className='sticky top-0 z-50 px-6 py-4 flex items-center justify-between'
        style={{ background: 'rgba(10,10,20,0.8)', borderBottom: '1px solid rgba(99,102,241,0.2)', backdropFilter: 'blur(20px)' }}>

        <Link to='/' className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl flex items-center justify-center'
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Building2 className='h-5 w-5 text-white' />
          </div>
          <span className='font-bold text-lg text-white'>Admin Dashboard</span>
        </Link>

        <nav className='hidden md:flex items-center gap-2'>
          <Link to='/' className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            style={location.pathname === '/' ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' } : {}}>
            <LayoutDashboard className='h-4 w-4' />
            Organizations
          </Link>
        </nav>

        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl'
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white'
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user?.email?.[0].toUpperCase()}
            </div>
            <span className='text-sm text-gray-300'>{user?.email}</span>
          </div>
          <button onClick={handleSignOut}
            className='flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-all'
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <LogOut className='h-4 w-4' />
            <span className='hidden sm:inline'>Sign Out</span>
          </button>
        </div>
      </header>

      <main className='max-w-5xl mx-auto px-4 py-8'>
        <Outlet />
      </main>
    </div>
  );
}