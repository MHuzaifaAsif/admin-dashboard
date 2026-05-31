import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { createOrgSchema, CreateOrgInput } from '@/lib/validations';
import { Plus, X, Building2 } from 'lucide-react';

export function CreateOrgDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<CreateOrgInput>({
    resolver: zodResolver(createOrgSchema),
  });
  const orgType = watch('type');

  const onSubmit = async (data: CreateOrgInput) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('organizations').insert([{
      ...data,
      created_by: user?.id,
    }]);
    if (error) {
      console.error(error);
    } else {
      reset();
      setOpen(false);
      onSuccess();
    }
  };

  const orgTypes = [
    { value: 'School', label: 'School', icon: '🏫', color: '#60a5fa' },
    { value: 'Nonprofit', label: 'Nonprofit', icon: '🌿', color: '#34d399' },
    { value: 'Business', label: 'Business', icon: '🏢', color: '#a78bfa' },
  ];

  return (
    <>
      <button onClick={() => setOpen(true)}
        className='flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white text-sm transition-all'
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
        <Plus className='h-4 w-4' />
        Create Organization
      </button>

      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}>

          <div className='w-full max-w-md rounded-2xl p-6 relative'
            style={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 0 60px rgba(99,102,241,0.2)' }}>

            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl flex items-center justify-center'
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <Building2 className='h-5 w-5 text-white' />
                </div>
                <h2 className='text-xl font-bold text-white'>New Organization</h2>
              </div>
              <button onClick={() => setOpen(false)}
                className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors'
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X className='h-4 w-4' />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              {/* Name */}
              <div>
                <label className='block text-sm font-medium mb-2' style={{ color: '#94a3b8' }}>
                  Organization Name
                </label>
                <input {...register('name')} placeholder='Enter organization name'
                  className='w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all'
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.3)' }} />
                {errors.name && <p className='text-red-400 text-sm mt-1'>{errors.name.message}</p>}
              </div>

              {/* Type selector */}
              <div>
                <label className='block text-sm font-medium mb-2' style={{ color: '#94a3b8' }}>
                  Organization Type
                </label>
                <div className='grid grid-cols-3 gap-2'>
                  {orgTypes.map(type => (
                    <button key={type.value} type='button'
                      onClick={() => setValue('type', type.value as any)}
                      className='flex flex-col items-center gap-2 p-3 rounded-xl transition-all'
                      style={{
                        background: orgType === type.value ? `rgba(99,102,241,0.2)` : 'rgba(255,255,255,0.03)',
                        border: orgType === type.value ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                      <span className='text-2xl'>{type.icon}</span>
                      <span className='text-xs font-medium' style={{ color: orgType === type.value ? '#818cf8' : '#64748b' }}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.type && <p className='text-red-400 text-sm mt-1'>{errors.type.message}</p>}
              </div>

              {/* Conditional fields */}
              {orgType === 'School' && (
                <div>
                  <label className='block text-sm font-medium mb-2' style={{ color: '#94a3b8' }}>
                    🏫 School District
                  </label>
                  <input {...register('school_district')} placeholder='Enter school district'
                    className='w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none'
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.3)' }} />
                  {errors.school_district && <p className='text-red-400 text-sm mt-1'>{errors.school_district.message}</p>}
                </div>
              )}

              {orgType === 'Nonprofit' && (
                <div>
                  <label className='block text-sm font-medium mb-2' style={{ color: '#94a3b8' }}>
                    🌿 EIN Number
                  </label>
                  <input {...register('nonprofit_ein')} placeholder='XX-XXXXXXX'
                    className='w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none'
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(52,211,153,0.3)' }} />
                  {errors.nonprofit_ein && <p className='text-red-400 text-sm mt-1'>{errors.nonprofit_ein.message}</p>}
                </div>
              )}

              {orgType === 'Business' && (
                <div>
                  <label className='block text-sm font-medium mb-2' style={{ color: '#94a3b8' }}>
                    🏢 Business Registration Number
                  </label>
                  <input {...register('business_registration')} placeholder='Enter registration number'
                    className='w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none'
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.3)' }} />
                  {errors.business_registration && <p className='text-red-400 text-sm mt-1'>{errors.business_registration.message}</p>}
                </div>
              )}

              <button type='submit' disabled={isSubmitting}
                className='w-full py-3 rounded-xl font-semibold text-white transition-all'
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                {isSubmitting ? 'Creating...' : 'Create Organization'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}