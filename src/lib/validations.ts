import { z } from 'zod';

export const createOrgSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['School', 'Nonprofit', 'Business']),
  school_district: z.string().optional(),
  nonprofit_ein: z.string().optional(),
  business_registration: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'School' && !data.school_district) {
    ctx.addIssue({ code: z.ZodIssueCode.custom,
      message: 'School district is required for School type',
      path: ['school_district'] });
  }
  if (data.type === 'Nonprofit' && !data.nonprofit_ein) {
    ctx.addIssue({ code: z.ZodIssueCode.custom,
      message: 'EIN is required for Nonprofit type',
      path: ['nonprofit_ein'] });
  }
  if (data.type === 'Business' && !data.business_registration) {
    ctx.addIssue({ code: z.ZodIssueCode.custom,
      message: 'Registration number is required for Business type',
      path: ['business_registration'] });
  }
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;