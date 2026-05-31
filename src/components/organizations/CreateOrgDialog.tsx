import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { createOrgSchema, CreateOrgInput } from '@/lib/validations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

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
    alert(error.message);
  } else {
    reset();
    setOpen(false);
    onSuccess();
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className='h-4 w-4 mr-2' />Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Organization</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label>Name</Label>
            <Input {...register('name')} placeholder='Organization name' />
            {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
          </div>
          <div>
            <Label>Type</Label>
            <Select onValueChange={(v) => setValue('type', v as any)}>
              <SelectTrigger><SelectValue placeholder='Select type' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='School'>School</SelectItem>
                <SelectItem value='Nonprofit'>Nonprofit</SelectItem>
                <SelectItem value='Business'>Business</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className='text-red-500 text-sm'>{errors.type.message}</p>}
          </div>
          {orgType === 'School' && (
            <div>
              <Label>School District</Label>
              <Input {...register('school_district')} />
              {errors.school_district && <p className='text-red-500 text-sm'>{errors.school_district.message}</p>}
            </div>
          )}
          {orgType === 'Nonprofit' && (
            <div>
              <Label>EIN Number</Label>
              <Input {...register('nonprofit_ein')} placeholder='XX-XXXXXXX' />
              {errors.nonprofit_ein && <p className='text-red-500 text-sm'>{errors.nonprofit_ein.message}</p>}
            </div>
          )}
          {orgType === 'Business' && (
            <div>
              <Label>Business Registration Number</Label>
              <Input {...register('business_registration')} />
              {errors.business_registration && <p className='text-red-500 text-sm'>{errors.business_registration.message}</p>}
            </div>
          )}
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}