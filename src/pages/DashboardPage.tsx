import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Organization } from '@/types';
import { CreateOrgDialog } from '@/components/organizations/CreateOrgDialog';
import { Building2, Users, Calendar, ChevronRight, Plus } from 'lucide-react';

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  School: { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
  Nonprofit: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
  Business: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
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

  return (
    <div>
      {/* Page header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-1'>My Organizations</h1>
          <p className='text-sm' style={{ color: '#64748b' }}>
            {orgs?.length ?? 0} organization{orgs?.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <CreateOrgDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ['organizations'] })} />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className='space-y-3'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-24 rounded-2xl animate-pulse'
              style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && orgs?.length === 0 && (
        <div className='flex flex-col items-center justify-center py-24 rounded-2xl'
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(99,102,241,0.3)' }}>
          <div className='w-16 h-16 rounded-2xl flex items-center justify-center mb-4'
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Building2 className='h-8 w-8' style={{ color: '#6366f1' }} />
          </div>
          <h3 className='text-lg font-semibold text-white mb-2'>No organizations yet</h3>
          <p className='text-sm mb-6' style={{ color: '#64748b' }}>Create your first organization to get started</p>
          <CreateOrgDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ['organizations'] })} />
        </div>
      )}

      {/* Organizations list */}
      <div className='space-y-3'>
        {orgs?.map(org => {
          const config = typeConfig[org.type] ?? typeConfig.Business;
          return (
            <div key={org.id}
              className='group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200'
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.08)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
              onClick={() => navigate(`/organizations/${org.id}`)}>

              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0'
                  style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                  <Building2 className='h-6 w-6' style={{ color: config.color }} />
                </div>
                <div>
                  <h2 className='font-semibold text-white text-lg'>{org.name}</h2>
                  <div className='flex items-center gap-3 mt-1'>
                    <span className='flex items-center gap-1 text-xs'
                      style={{ color: '#64748b' }}>
                      <Calendar className='h-3 w-3' />
                      {new Date(org.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <span className='text-xs font-medium px-3 py-1 rounded-full'
                  style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color }}>
                  {org.type}
                </span>
                <ChevronRight className='h-5 w-5 text-gray-600 group-hover:text-gray-400 transition-colors' />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}