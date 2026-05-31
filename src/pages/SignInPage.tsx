import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Admin Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label>Email</Label>
              <Input {...register('email')} type='email' placeholder='admin@example.com' />
              {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
            </div>
            <div>
              <Label>Password</Label>
              <Input {...register('password')} type='password' />
              {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
            </div>
            {errors.root && <p className='text-red-500 text-sm'>{errors.root.message}</p>}
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className='text-center text-sm text-gray-600'>
              No account? <Link to='/signup' className='text-blue-600 underline'>Sign up</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}