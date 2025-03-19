
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AgentCollaboration {
  id: string;
  projectId: string;
  agents: string[]; // Agent IDs
  collaborationLevel: number;
  status: 'idle' | 'active' | 'completed';
  insights: string[];
  createdAt: string;
}

serve(async (req) => {
  try {
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Initialize Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { collaborationId } = await req.json();
    
    if (!collaborationId) {
      return new Response(
        JSON.stringify({ error: 'Collaboration ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get collaboration details
    const { data: collaboration, error: collabError } = await supabase
      .from('agent_collaborations')
      .select('*')
      .eq('id', collaborationId)
      .single();
    
    if (collabError || !collaboration) {
      return new Response(
        JSON.stringify({ error: 'Collaboration not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update collaboration status to active
    const { error: updateError } = await supabase
      .from('agent_collaborations')
      .update({
        status: 'active',
      })
      .eq('id', collaborationId);
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update collaboration status' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Process each agent in the collaboration
    const agentPromises = collaboration.agents.map(async (agentId: string) => {
      // Create a task for each agent
      const taskId = crypto.randomUUID();
      const { error: taskError } = await supabase
        .from('agent_tasks')
        .insert([{
          id: taskId,
          agentId,
          projectId: collaboration.projectId,
          taskType: 'analyze',
          status: 'queued',
          input: {
            projectId: collaboration.projectId,
            collaborationId,
            collaborationLevel: collaboration.collaborationLevel
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
      
      if (taskError) {
        throw new Error(`Failed to create task for agent ${agentId}: ${taskError.message}`);
      }
      
      // Process the task
      // In a real implementation, this would be handled by a queue
      // For simplicity, we're processing it directly
      const response = await fetch(`${supabaseUrl}/functions/v1/process-agent-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ taskId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to process task for agent ${agentId}`);
      }
      
      return await response.json();
    });
    
    try {
      // Process all agent tasks in parallel
      const agentResults = await Promise.all(agentPromises);
      
      // After all agents have completed their tasks, create a collaboration task
      const collaborationTaskId = crypto.randomUUID();
      const { error: collabTaskError } = await supabase
        .from('agent_tasks')
        .insert([{
          id: collaborationTaskId,
          agentId: 'collaboration',
          projectId: collaboration.projectId,
          taskType: 'collaborate',
          status: 'queued',
          input: {
            projectId: collaboration.projectId,
            collaborationId,
            agents: collaboration.agents,
            collaborationLevel: collaboration.collaborationLevel,
            agentResults
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
      
      if (collabTaskError) {
        throw new Error(`Failed to create collaboration task: ${collabTaskError.message}`);
      }
      
      // Process the collaboration task
      const collabResponse = await fetch(`${supabaseUrl}/functions/v1/process-agent-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ taskId: collaborationTaskId })
      });
      
      if (!collabResponse.ok) {
        throw new Error('Failed to process collaboration task');
      }
      
      const collabResult = await collabResponse.json();
      
      // Update collaboration with final results
      const { error: finalUpdateError } = await supabase
        .from('agent_collaborations')
        .update({
          status: 'completed',
          insights: collabResult.result.insights || []
        })
        .eq('id', collaborationId);
      
      if (finalUpdateError) {
        throw new Error(`Failed to update collaboration with results: ${finalUpdateError.message}`);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          collaborationId, 
          result: collabResult.result 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      // Update collaboration status to error
      await supabase
        .from('agent_collaborations')
        .update({
          status: 'error'
        })
        .eq('id', collaborationId);
      
      throw error;
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})
