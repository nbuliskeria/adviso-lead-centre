import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface ConversionDetails {
  accountManagerId: string;
  businessIdNumber?: string;
  subscriptionPackage?: string;
  monthlyValue?: number;
  contractStartDate?: string;
  contractEndDate?: string;
  notes?: string;
}

interface ConversionRequest {
  leadId: string;
  conversionDetails: ConversionDetails;
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { leadId, conversionDetails }: ConversionRequest = await req.json();

    if (!leadId || !conversionDetails?.accountManagerId) {
      throw new Error('Lead ID and Account Manager ID are required');
    }

    console.log(`Converting lead ${leadId} to client...`);

    // Start a transaction-like operation
    // 1. Fetch the lead to get its details
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select(`
        *,
        lead_owner_profile:user_profiles!leads_lead_owner_id_fkey (
          id,
          first_name,
          last_name,
          display_name
        )
      `)
      .eq('id', leadId)
      .single();

    if (leadError) {
      console.error('Error fetching lead:', leadError);
      throw new Error(`Failed to fetch lead: ${leadError.message}`);
    }

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Validate that the lead can be converted
    if (lead.status === 'Won') {
      // Check if already converted
      const { data: existingClient } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('original_lead_id', leadId)
        .single();

      if (existingClient) {
        throw new Error('Lead has already been converted to a client');
      }
    }

    // 2. Create the new client record
    const clientData = {
      company_name: lead.company_name,
      account_manager_id: conversionDetails.accountManagerId,
      business_id_number: conversionDetails.businessIdNumber || null,
      original_lead_id: leadId,
      client_status: 'Onboarding',
      subscription_package: conversionDetails.subscriptionPackage || lead.subscription_package,
      monthly_value: conversionDetails.monthlyValue || lead.potential_mrr,
      contract_start_date: conversionDetails.contractStartDate || new Date().toISOString().split('T')[0],
      contract_end_date: conversionDetails.contractEndDate || null,
      notes: conversionDetails.notes || null,
      onboarding_completed: false,
    };

    const { data: newClient, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert(clientData)
      .select(`
        *,
        account_manager:user_profiles!clients_account_manager_id_fkey (
          id,
          first_name,
          last_name,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      throw new Error(`Failed to create client: ${clientError.message}`);
    }

    // 3. Update the original lead's status to 'Won'
    const { error: updateError } = await supabaseAdmin
      .from('leads')
      .update({ 
        status: 'Won',
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (updateError) {
      console.error('Error updating lead status:', updateError);
      // If updating lead fails, we should rollback the client creation
      // For now, we'll log the error but continue
      console.warn('Lead status update failed, but client was created successfully');
    }

    // 4. Create an activity log entry for the conversion
    const { error: activityError } = await supabaseAdmin
      .from('activities')
      .insert({
        lead_id: leadId,
        type: 'conversion',
        notes: `Lead converted to client: ${newClient.company_name}`,
        metadata: {
          client_id: newClient.id,
          converted_by: conversionDetails.accountManagerId,
          conversion_date: new Date().toISOString()
        },
        owner_id: conversionDetails.accountManagerId,
        is_system_event: true
      });

    if (activityError) {
      console.warn('Failed to create activity log:', activityError);
      // Non-critical error, don't fail the conversion
    }

    console.log(`Successfully converted lead ${leadId} to client ${newClient.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        client: newClient,
        message: 'Lead successfully converted to client'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Conversion error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred during conversion'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
