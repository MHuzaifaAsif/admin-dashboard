import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Organization } from '@/types';
import { CreateOrgDialog } from '@/components/organizations/CreateOrgDialog';

const badgeColors: Record<string, string> = {
  School: 'bg-blue-100 text-blue-800',
  Nonprofit: 'bg-green-100 text-green-800',
  Business: 'bg-purple-100 text-purple-800',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orgs, isLoading } = useQuery({
    queryKey: ['organizations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Organization[];
    },
    enabled: !!user,
  });

  if (isLoading) return <div className='py-8 text-center text-gray-500'>Loading organizations...</div>;

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>My Organizations</h1>
        <CreateOrgDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ['organizations'] })} />
      </div>

      {orgs?.length === 0 && (
        <div className='text-center py-16 text-gray-400'>
          No organizations yet. Create your first one!
        </div>
      )}

      <div className='space-y-3'>
        {orgs?.map(org => (
          <div key={org.id}
            className='bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-sm cursor-pointer transition'
            onClick={() => navigate(`/organizations/${org.id}`)}
          >
            <div>
              <h2 className='font-semibold'>{org.name}</h2>
              <p className='text-sm text-gray-500'>Created {new Date(org.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColors[org.type]}`}>
              {org.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}