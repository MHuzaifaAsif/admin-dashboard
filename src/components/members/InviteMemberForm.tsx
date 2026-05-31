import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { inviteMemberSchema, InviteMemberInput } from '@/lib/validations';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2 items-end'>
      <div className='flex-1'>
        <Label>Invite by Email</Label>
        <Input {...register('email')} type='email' placeholder='member@example.com' />
        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
        {errors.root && <p className='text-red-500 text-sm'>{errors.root.message}</p>}
      </div>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Invite'}
      </Button>
    </form>
  );
}