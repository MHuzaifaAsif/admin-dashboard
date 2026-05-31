import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { InviteMemberForm } from '@/components/members/InviteMemberForm';
import { ArrowLeft, Users, Mail, Clock, Building2 } from 'lucide-react';

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  School: { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
  Nonprofit: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
  Business: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
};

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

  const config = org?.type ? typeConfig[org.type] ?? typeConfig.Business : typeConfig.Business;

  return (
    <div>
      {/* Back button */}
      <Link to='/' className='inline-flex items-center gap-2 text-sm mb-6 transition-colors'
        style={{ color: '#64748b' }}
        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'}
        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#64748b'}>
        <ArrowLeft className='h-4 w-4' />
        Back to Organizations
      </Link>

      {/* Org header */}
      <div className='flex items-center gap-4 mb-8'>
        <div className='w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0'
          style={{ background: config.bg, border: `1px solid ${config.border}` }}>
          <Building2 className='h-8 w-8' style={{ color: config.color }} />
        </div>
        <div>
          <div className='flex items-center gap-3'>
            <h1 className='text-3xl font-bold text-white'>{org?.name}</h1>
            <span className='text-xs font-medium px-3 py-1 rounded-full'
              style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color }}>
              {org?.type}
            </span>
          </div>
          <div className='flex items-center gap-4 mt-1'>
            <span className='flex items-center gap-1 text-sm' style={{ color: '#64748b' }}>
              <Users className='h-4 w-4' />
              {members?.length ?? 0} member{members?.length !== 1 ? 's' : ''}
            </span>
            {org?.created_at && (
              <span className='flex items-center gap-1 text-sm' style={{ color: '#64748b' }}>
                <Clock className='h-4 w-4' />
                Created {new Date(org.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conditional type fields */}
      {org?.school_district && (
        <div className='mb-6 px-4 py-3 rounded-xl text-sm'
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
          🏫 School District: <span className='font-medium'>{org.school_district}</span>
        </div>
      )}
      {org?.nonprofit_ein && (
        <div className='mb-6 px-4 py-3 rounded-xl text-sm'
          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7' }}>
          🌿 EIN: <span className='font-medium'>{org.nonprofit_ein}</span>
        </div>
      )}
      {org?.business_registration && (
        <div className='mb-6 px-4 py-3 rounded-xl text-sm'
          style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#c4b5fd' }}>
          🏢 Registration: <span className='font-medium'>{org.business_registration}</span>
        </div>
      )}

      {/* Invite form */}
      <div className='p-6 rounded-2xl mb-6'
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className='flex items-center gap-2 mb-4'>
          <Mail className='h-5 w-5' style={{ color: '#6366f1' }} />
          <h2 className='font-semibold text-white text-lg'>Invite Member</h2>
        </div>
        <InviteMemberForm organizationId={id!} />
      </div>

      {/* Members list */}
      <div className='p-6 rounded-2xl'
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className='flex items-center gap-2 mb-4'>
          <Users className='h-5 w-5' style={{ color: '#6366f1' }} />
          <h2 className='font-semibold text-white text-lg'>Members</h2>
          <span className='ml-auto text-xs px-2 py-1 rounded-full'
            style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
            {members?.length ?? 0}
          </span>
        </div>

        {isLoading && (
          <div className='space-y-3'>
            {[1, 2].map(i => (
              <div key={i} className='h-14 rounded-xl animate-pulse'
                style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        )}

        {!isLoading && members?.length === 0 && (
          <div className='flex flex-col items-center py-10'>
            <Users className='h-10 w-10 mb-3' style={{ color: '#334155' }} />
            <p className='text-sm' style={{ color: '#475569' }}>No members yet. Invite someone above!</p>
          </div>
        )}

        <div className='space-y-2'>
          {members?.map(m => (
            <div key={m.id}
              className='flex items-center justify-between px-4 py-3 rounded-xl'
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white'
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {m.email[0].toUpperCase()}
                </div>
                <span className='text-sm text-gray-300'>{m.email}</span>
              </div>
              <span className='text-xs font-medium px-3 py-1 rounded-full'
                style={m.status === 'active'
                  ? { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }
                  : { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}