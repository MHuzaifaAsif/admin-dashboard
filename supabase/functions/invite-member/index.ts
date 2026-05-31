import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { organization_id, email } = await req.json();

    if (!organization_id || !email) {
      return new Response(JSON.stringify({ error: 'organization_id and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .select('id')
      .eq('id', organization_id)
      .eq('created_by', user.id)
      .single();

    if (orgError || !org) {
      return new Response(JSON.stringify({ error: 'Organization not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: existing } = await supabaseClient
      .from('organization_members')
      .select('id')
      .eq('organization_id', organization_id)
      .eq('email', email)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ error: 'This email has already been invited' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: invitation, error: insertError } = await supabaseClient
      .from('organization_members')
      .insert([{ organization_id, email, status: 'invited' }])
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, invitation }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});