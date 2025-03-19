
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define interface for agent batch
interface AgentBatch {
  id: string;
  projectId: string;
  agentIds: string[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface AgentTask {
  id: string;
  agentId: string;
  projectId: string;
  taskType: 'analyze' | 'validate' | 'collaborate';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  input: any;
  output?: any;
  createdAt: string;
  updatedAt: string;
  batchId?: string;
}

serve(async (req) => {
  try {
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Initialize Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { batchId } = await req.json();
    
    if (!batchId) {
      return new Response(
        JSON.stringify({ error: 'Batch ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get batch details
    const { data: batch, error: batchError } = await supabase
      .from('agent_batches')
      .select('*')
      .eq('id', batchId)
      .single();
    
    if (batchError || !batch) {
      return new Response(
        JSON.stringify({ error: 'Batch not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update batch status to processing
    await supabase
      .from('agent_batches')
      .update({
        status: 'processing',
        updatedAt: new Date().toISOString()
      })
      .eq('id', batchId);
    
    // Get all tasks in this batch
    const { data: tasks, error: tasksError } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('batchId', batchId);
    
    if (tasksError) {
      throw new Error(`Failed to get batch tasks: ${tasksError.message}`);
    }
    
    // Process all tasks in parallel
    const processTasks = async () => {
      if (!tasks || tasks.length === 0) {
        return [];
      }
      
      // Get project data to analyze (we only need to do this once for the batch)
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('data')
        .eq('id', batch.projectId)
        .single();
      
      if (projectError) {
        throw new Error(`Failed to get project data: ${projectError.message}`);
      }
      
      // Create a shared context array that all agents can use
      const sharedAnalysisContext = [];
      
      // Process each task in the batch
      const taskPromises = tasks.map(async (task) => {
        try {
          // Update task status to processing
          await supabase
            .from('agent_tasks')
            .update({
              status: 'processing',
              updatedAt: new Date().toISOString()
            })
            .eq('id', task.id);
          
          // Get agent details
          const { data: agent, error: agentError } = await supabase
            .from('agents')
            .select('*')
            .eq('id', task.agentId)
            .single();
          
          if (agentError) {
            throw new Error(`Failed to get agent: ${agentError.message}`);
          }
          
          // Get summarized context if available, otherwise get regular history
          let agentContext = [];
          if (agent.contextSummary) {
            // Use the summary as the primary context
            agentContext.push({
              id: 'context-summary',
              agentId: agent.id,
              timestamp: new Date().toISOString(),
              content: agent.contextSummary,
              type: 'input',
              metadata: { isContextSummary: true }
            });
            
            // Get only non-compressed interactions
            const { data: recentHistory, error: historyError } = await supabase
              .from('agent_interactions')
              .select('*')
              .eq('agentId', agent.id)
              .eq('isCompressed', false)
              .order('timestamp', { ascending: true });
            
            if (!historyError && recentHistory) {
              agentContext = [...agentContext, ...recentHistory];
            }
          } else {
            // Get regular history
            const { data: agentHistory, error: historyError } = await supabase
              .from('agent_interactions')
              .select('*')
              .eq('agentId', agent.id)
              .order('timestamp', { ascending: true })
              .limit(10);
            
            if (!historyError && agentHistory) {
              agentContext = agentHistory;
            }
          }
          
          // Get agent's prompt
          const { data: agentPrompt, error: promptError } = await supabase
            .from('agent_prompts')
            .select('*')
            .eq('agent_id', agent.id)
            .single();
          
          // If no custom prompt, create a default one
          const prompt = agentPrompt || {
            role: `You are an AI assistant specializing in ${agent.type} analysis for qualitative research.`,
            instructions: getDefaultInstructions(agent.id)
          };
          
          // Determine task type and process accordingly
          let result;
          switch (task.taskType) {
            case 'analyze':
              result = await performBatchAnalysis(
                task, 
                agent, 
                prompt, 
                projectData, 
                agentContext, 
                sharedAnalysisContext, 
                supabase, 
                openaiApiKey
              );
              
              // Add to shared context
              if (result && result.analysis) {
                sharedAnalysisContext.push({
                  agentId: agent.id,
                  agentName: agent.name,
                  agentType: agent.type,
                  analysis: result.analysis,
                  insights: result.insights || []
                });
              }
              break;
              
            default:
              throw new Error(`Task type ${task.taskType} not supported in batch mode`);
          }
          
          // Update task with results
          await supabase
            .from('agent_tasks')
            .update({
              status: 'completed',
              output: result,
              updatedAt: new Date().toISOString()
            })
            .eq('id', task.id);
          
          // Update agent with insights and completed status
          await supabase
            .from('agents')
            .update({
              status: 'complete',
              insights: result.insights || [],
              confidence: result.confidence || 0.85,
              updatedAt: new Date().toISOString()
            })
            .eq('id', agent.id);
          
          // Compress agent context
          if (agentContext.length > 15) {
            await fetch(`${supabaseUrl}/functions/v1/summarize-agent-context`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`
              },
              body: JSON.stringify({ agentId: agent.id })
            });
          }
          
          return result;
        } catch (error) {
          console.error(`Error processing task ${task.id}:`, error);
          
          // Update task status to failed
          await supabase
            .from('agent_tasks')
            .update({
              status: 'failed',
              output: { error: error.message },
              updatedAt: new Date().toISOString()
            })
            .eq('id', task.id);
          
          // Update agent status to error
          await supabase
            .from('agents')
            .update({
              status: 'error',
              updatedAt: new Date().toISOString()
            })
            .eq('id', task.agentId);
          
          return { error: error.message };
        }
      });
      
      return await Promise.all(taskPromises);
    };
    
    // Execute all tasks
    const results = await processTasks();
    
    // Check if this batch is part of a collaboration
    const collaborationId = tasks[0]?.input?.collaborationId;
    if (collaborationId) {
      // Create a collaboration task
      const collaborationTaskId = crypto.randomUUID();
      
      await supabase
        .from('agent_tasks')
        .insert([{
          id: collaborationTaskId,
          agentId: 'collaboration',
          projectId: batch.projectId,
          taskType: 'collaborate',
          status: 'queued',
          input: {
            projectId: batch.projectId,
            collaborationId,
            agents: batch.agentIds,
            collaborationLevel: tasks[0]?.input?.collaborationLevel || 0.5,
            agentResults: results.filter(r => !r.error)
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
      
      // Process the collaboration task
      await fetch(`${supabaseUrl}/functions/v1/process-agent-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ taskId: collaborationTaskId })
      });
    }
    
    // Update batch status to completed
    await supabase
      .from('agent_batches')
      .update({
        status: 'completed',
        updatedAt: new Date().toISOString()
      })
      .eq('id', batchId);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        batchId,
        results,
        taskCount: tasks.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function performBatchAnalysis(
  task: AgentTask, 
  agent: any, 
  prompt: any, 
  projectData: any, 
  agentContext: any[],
  sharedContext: any[],
  supabaseClient: any,
  openaiApiKey: string
): Promise<any> {
  // Prepare the messages for OpenAI
  const messages = [
    { role: "system", content: `${prompt.role}\n\n${prompt.instructions}` },
    { role: "user", content: `Analyze the following qualitative data:\n\n${JSON.stringify(projectData.data, null, 2)}` }
  ];
  
  // Add context if available
  if (agentContext && agentContext.length > 0) {
    // Filter to only include the most relevant context
    const contextMessages = agentContext.map(interaction => {
      if (interaction.type === 'input') {
        return { role: "user", content: interaction.content };
      } else if (interaction.type === 'output') {
        return { role: "assistant", content: interaction.content };
      } else {
        return null;
      }
    }).filter(Boolean);
    
    // Insert relevant history messages between system and user message
    if (contextMessages.length > 0) {
      messages.splice(1, 0, ...contextMessages);
    }
  }
  
  // Add shared context from other agents if this is not the first agent
  if (sharedContext.length > 0) {
    const sharedContextMessage = {
      role: "user", 
      content: `Other agents have provided the following analyses:\n\n${
        sharedContext.map(ctx => 
          `Agent: ${ctx.agentName} (${ctx.agentType})\nKey insights: ${
            ctx.insights.join('; ')
          }`
        ).join('\n\n')
      }\n\nYou may consider these perspectives in your analysis, but focus on your own expertise and methodology.`
    };
    messages.push(sharedContextMessage);
  }
  
  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.5,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }
  
  const result = await response.json();
  const analysis = result.choices[0].message.content;
  
  // Extract insights from analysis
  const insights = await extractInsightsFromAnalysis(analysis, openaiApiKey);
  
  // Record the interaction
  const now = new Date().toISOString();
  
  // Record input
  await supabaseClient
    .from('agent_interactions')
    .insert([{
      id: crypto.randomUUID(),
      agentId: agent.id,
      timestamp: now,
      content: `Analyze the qualitative data for project ${task.projectId}`,
      type: 'input'
    }]);
  
  // Record output
  await supabaseClient
    .from('agent_interactions')
    .insert([{
      id: crypto.randomUUID(),
      agentId: agent.id,
      timestamp: now,
      content: analysis,
      type: 'output'
    }]);
  
  // Record insights
  for (const insight of insights) {
    await supabaseClient
      .from('agent_interactions')
      .insert([{
        id: crypto.randomUUID(),
        agentId: agent.id,
        timestamp: now,
        content: insight,
        type: 'insight'
      }]);
  }
  
  return {
    analysis,
    insights,
    confidence: 0.85,
    analysisCompleted: true
  };
}

async function extractInsightsFromAnalysis(analysis: string, openaiApiKey: string): Promise<string[]> {
  // This function is the same as in process-agent-task
  // Call OpenAI to extract insights
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: "system", content: "Extract the 3-5 most important insights from the analysis. Format each insight as a clear, concise statement. Return ONLY an array of strings in JSON format." },
        { role: "user", content: analysis }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })
  });
  
  if (!response.ok) {
    // If extraction fails, return empty array
    console.error(`Warning: Failed to extract insights: ${await response.text()}`);
    return [];
  }
  
  try {
    const result = await response.json();
    const content = result.choices[0].message.content;
    const parsed = JSON.parse(content);
    return Array.isArray(parsed.insights) ? parsed.insights : [];
  } catch (error) {
    console.error(`Warning: Failed to parse insights: ${error}`);
    return [];
  }
}

// Helper function to get default instructions based on agent ID
function getDefaultInstructions(agentId: string): string {
  // Determine agent type from ID
  let agentType = 'methodology';
  
  const methodologyAgents = ['grounded-theory', 'phenomenology', 'discourse-analysis', 'narrative-analysis'];
  const theoreticalAgents = ['feminist-theory', 'critical-race-theory', 'post-colonialism', 'structuralism'];
  const validationAgents = ['bias-identification', 'assumption-validation', 'triangulation', 'member-checking'];
  
  if (methodologyAgents.includes(agentId)) agentType = 'methodology';
  else if (theoreticalAgents.includes(agentId)) agentType = 'theoretical';
  else if (validationAgents.includes(agentId)) agentType = 'validation';
  
  // Get agent name from ID
  const agentName = agentId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  switch (agentType) {
    case 'methodology':
      return `Analyze the qualitative data using ${agentName} approach. 
      Focus on identifying patterns, themes, and insights that emerge from the data. 
      Explain your analysis process and provide evidence from the data to support your findings.`;
    
    case 'theoretical':
      return `Interpret the qualitative data through the lens of ${agentName}. 
      Identify key concepts, power structures, and social dynamics evident in the data. 
      Provide a critical analysis that highlights implications for research and practice.`;
    
    case 'validation':
      return `Evaluate the quality and trustworthiness of the analysis using ${agentName}. 
      Identify potential biases, assumptions, and limitations in the data and analysis. 
      Suggest ways to enhance rigor and credibility of the findings.`;
      
    default:
      return 'Analyze the qualitative data and provide insights based on your expertise.';
  }
}
