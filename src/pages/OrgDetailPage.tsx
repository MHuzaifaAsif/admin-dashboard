import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { InviteMemberForm } from '@/components/members/InviteMemberForm';
import { ArrowLeft } from 'lucide-react';

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: org } = useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id!)
        .single();
      return data;
    },
  });

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', id!)
        .order('invited_at', { ascending: false });
      return data;
    },
  });

  const badgeColors: Record<string, string> = {
    School: 'bg-blue-100 text-blue-800',
    Nonprofit: 'bg-green-100 text-green-800',
    Business: 'bg-purple-100 text-purple-800',
  };

  return (
    <div>
      <Link to='/' className='flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-800'>
        <ArrowLeft className='h-4 w-4' /> Back to Organizations
      </Link>

      <div className='flex items-center gap-3 mb-6'>
        <h1 className='text-2xl font-bold'>{org?.name}</h1>
        {org?.type && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColors[org.type]}`}>
            {org.type}
          </span>
        )}
      </div>

      <div className='bg-white border rounded-lg p-4 mb-6'>
        <h2 className='font-semibold mb-3'>Invite Member</h2>
        <InviteMemberForm organizationId={id!} />
      </div>

      <div className='bg-white border rounded-lg p-4'>
        <h2 className='font-semibold mb-3'>Members</h2>
        {isLoading && <p className='text-gray-400'>Loading members...</p>}
        {!isLoading && members?.length === 0 && (
          <p className='text-gray-400'>No members yet. Invite someone above!</p>
        )}
        {members?.map(m => (
          <div key={m.id} className='flex items-center justify-between py-2 border-b last:border-0'>
            <span className='text-sm'>{m.email}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              m.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}