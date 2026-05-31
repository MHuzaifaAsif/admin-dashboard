import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignInPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setError('root', { message: error.message });
    } else {
      navigate('/');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden'
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0f1a 100%)' }}>

      <div className='absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl'
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl'
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      <div className='absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl'
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

      <div className='relative z-10 w-full max-w-md mx-4 rounded-2xl p-8'
        style={{ background: 'rgba(15, 15, 30, 0.8)', border: '1px solid rgba(99, 102, 241, 0.3)', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(99, 102, 241, 0.15)' }}>

        <div className='flex justify-center mb-8'>
          <div className='w-16 h-16 rounded-2xl flex items-center justify-center'
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
            </svg>
          </div>
        </div>

        <h1 className='text-2xl font-bold text-center text-white mb-1'>Welcome Back</h1>
        <p className='text-center text-sm mb-8' style={{ color: '#94a3b8' }}>Sign in to your admin dashboard</p>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2' style={{ color: '#94a3b8' }}>Email</label>
            <input {...register('email')} type='email' placeholder='admin@example.com'
              className='w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all'
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.3)' }} />
            {errors.email && <p className='text-red-400 text-sm mt-1'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2' style={{ color: '#94a3b8' }}>Password</label>
            <input {...register('password')} type='password' placeholder='••••••••'
              className='w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all'
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.3)' }} />
            {errors.password && <p className='text-red-400 text-sm mt-1'>{errors.password.message}</p>}
          </div>

          {errors.root && (
            <div className='px-4 py-3 rounded-xl text-red-400 text-sm'
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              {errors.root.message}
            </div>
          )}

          <button type='submit' disabled={isSubmitting}
            className='w-full py-3 rounded-xl font-semibold text-white transition-all mt-2'
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className='text-center text-sm' style={{ color: '#64748b' }}>
            No account?{' '}
            <Link to='/signup' className='font-medium' style={{ color: '#818cf8' }}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}