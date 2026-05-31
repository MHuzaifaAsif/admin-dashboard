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
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name }
      }
    });
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
          <CardTitle>Create Admin Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label>Full Name</Label>
              <Input {...register('full_name')} placeholder='John Doe' />
              {errors.full_name && <p className='text-red-500 text-sm mt-1'>{errors.full_name.message}</p>}
            </div>
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
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
            <p className='text-center text-sm text-gray-600'>
              Already have an account? <Link to='/signin' className='text-blue-600 underline'>Sign in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}