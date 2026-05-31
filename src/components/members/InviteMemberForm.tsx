import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { inviteMemberSchema, InviteMemberInput } from '@/lib/validations';
import { useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';

export function InviteMemberForm({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
  });

  const onSubmit = async (data: InviteMemberInput) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-member`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ organization_id: organizationId, email: data.email }),
      }
    );
    const result = await res.json();
    if (!res.ok) {
      setError('root', { message: result.error });
    } else {
      reset();
      queryClient.invalidateQueries({ queryKey: ['members', organizationId] });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
      <div className='flex gap-3'>
        <div className='flex-1'>
          <input
            {...register('email')}
            type='email'
            placeholder='member@example.com'
            className='w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all'
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.3)' }}
          />
        </div>
        <button
          type='submit'
          disabled={isSubmitting}
          className='flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white text-sm transition-all flex-shrink-0'
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
          <Send className='h-4 w-4' />
          {isSubmitting ? 'Sending...' : 'Invite'}
        </button>
      </div>

      {errors.email && (
        <p className='text-red-400 text-sm'>{errors.email.message}</p>
      )}

      {errors.root && (
        <div className='px-4 py-3 rounded-xl text-red-400 text-sm'
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          {errors.root.message}
        </div>
      )}
    </form>
  );
}