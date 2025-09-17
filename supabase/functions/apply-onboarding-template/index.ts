import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface ApplyTemplateRequest {
  clientId: string;
  templateId: string;
  assigneeId?: string;
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

    const { clientId, templateId, assigneeId }: ApplyTemplateRequest = await req.json();

    if (!clientId || !templateId) {
      throw new Error('Client ID and Template ID are required');
    }

    console.log(`Applying template ${templateId} to client ${clientId}...`);

    // 1. Fetch the client to ensure it exists
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, company_name, account_manager_id')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      throw new Error('Client not found');
    }

    // 2. Fetch the template and its items
    const { data: template, error: templateError } = await supabaseAdmin
      .from('task_templates')
      .select(`
        *,
        items:task_template_items (*)
      `)
      .eq('id', templateId)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found or inactive');
    }

    if (!template.items || template.items.length === 0) {
      throw new Error('Template has no items to apply');
    }

    // 3. Check if tasks already exist for this client from this template
    const { data: existingTasks } = await supabaseAdmin
      .from('client_tasks')
      .select('id')
      .eq('lead_id', clientId)
      .like('notes', `%Template: ${template.name}%`);

    if (existingTasks && existingTasks.length > 0) {
      throw new Error('Onboarding tasks have already been created for this client');
    }

    // 4. Calculate due dates and create tasks
    const today = new Date();
    const defaultAssignee = assigneeId || client.account_manager_id;

    const tasksToCreate = template.items
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map((item) => {
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + (item.due_days || 1));

        return {
          lead_id: clientId, // Using lead_id field for client tasks
          task_id: `ONBOARD-${clientId.slice(-8)}-${item.order_index || 0}`,
          title: item.title,
          description: item.description || '',
          assignee: 'System Generated', // Will be updated with actual assignee name
          assignee_id: defaultAssignee,
          status: 'To Do',
          priority: item.priority || 'Medium',
          category: item.category || 'Setup',
          due_date: dueDate.toISOString().split('T')[0],
          estimated_hours: item.estimated_hours || null,
          notes: `Template: ${template.name} | Order: ${item.order_index || 0}`,
          created_by: defaultAssignee,
        };
      });

    // 5. Insert all tasks in batch
    const { data: createdTasks, error: tasksError } = await supabaseAdmin
      .from('client_tasks')
      .insert(tasksToCreate)
      .select();

    if (tasksError) {
      console.error('Error creating tasks:', tasksError);
      throw new Error(`Failed to create onboarding tasks: ${tasksError.message}`);
    }

    // 6. Update assignee names (fetch user profiles and update)
    if (defaultAssignee) {
      const { data: assigneeProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('display_name, first_name, last_name')
        .eq('id', defaultAssignee)
        .single();

      if (assigneeProfile) {
        const assigneeName = assigneeProfile.display_name || 
          `${assigneeProfile.first_name} ${assigneeProfile.last_name}`.trim() || 
          'Unassigned';

        await supabaseAdmin
          .from('client_tasks')
          .update({ assignee: assigneeName })
          .in('id', createdTasks.map(task => task.id));
      }
    }

    // 7. Create an activity log entry
    const { error: activityError } = await supabaseAdmin
      .from('activities')
      .insert({
        lead_id: clientId,
        type: 'template_applied',
        notes: `Applied onboarding template: ${template.name} (${createdTasks.length} tasks created)`,
        metadata: {
          template_id: templateId,
          template_name: template.name,
          tasks_created: createdTasks.length,
          applied_by: assigneeId
        },
        owner_id: defaultAssignee,
        is_system_event: true
      });

    if (activityError) {
      console.warn('Failed to create activity log:', activityError);
      // Non-critical error, don't fail the operation
    }

    console.log(`Successfully applied template ${templateId} to client ${clientId}, created ${createdTasks.length} tasks`);

    return new Response(
      JSON.stringify({ 
        success: true,
        tasks: createdTasks,
        template: template.name,
        message: `Successfully applied ${template.name} - ${createdTasks.length} tasks created`
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Template application error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred while applying template'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
