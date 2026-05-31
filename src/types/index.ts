export type OrgType = 'School' | 'Nonprofit' | 'Business';
export type MemberStatus = 'invited' | 'active';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  school_district?: string;
  nonprofit_ein?: string;
  business_registration?: string;
  created_by: string;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  email: string;
  status: MemberStatus;
  role: string;
  invited_at: string;
  joined_at?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  is_admin: boolean;
}