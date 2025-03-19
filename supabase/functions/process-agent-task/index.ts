
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define interface for agent task
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
}

interface AgentInteraction {
  id: string;
  agentId: string;
  timestamp: string;
  content: string;
  type: 'input' | 'output' | 'insight';
  metadata?: Record<string, any>;
}

interface AgentPrompt {
  role: string;
  methodology?: string;
  framework?: string;
  instructions: string;
  examples?: AgentInteraction[];
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
    const { taskId } = await req.json();
    
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (taskError || !task) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update task status to processing
    const { error: updateError } = await supabase
      .from('agent_tasks')
      .update({
        status: 'processing',
        updatedAt: new Date().toISOString()
      })
      .eq('id', taskId);
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update task status' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Process the task based on task type
    let result;
    try {
      result = await processAgentTask(task, supabase, openaiApiKey);
    } catch (error) {
      // Update task status to failed
      await supabase
        .from('agent_tasks')
        .update({
          status: 'failed',
          output: { error: error.message },
          updatedAt: new Date().toISOString()
        })
        .eq('id', taskId);
      
      // Update agent status to error
      await supabase
        .from('agents')
        .update({
          status: 'error',
          updatedAt: new Date().toISOString()
        })
        .eq('id', task.agentId);
      
      return new Response(
        JSON.stringify({ error: 'Task processing failed', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update task with results
    const { error: resultError } = await supabase
      .from('agent_tasks')
      .update({
        status: 'completed',
        output: result,
        updatedAt: new Date().toISOString()
      })
      .eq('id', taskId);
    
    if (resultError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update task with results' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, taskId, result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})

async function processAgentTask(task: AgentTask, supabaseClient: any, openaiApiKey: string): Promise<any> {
  const { agentId, taskType, projectId } = task;
  
  // Get agent details
  const { data: agent, error: agentError } = await supabaseClient
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();
  
  if (agentError) {
    throw new Error(`Failed to get agent: ${agentError.message}`);
  }
  
  // Get agent's history
  const { data: agentHistory, error: historyError } = await supabaseClient
    .from('agent_interactions')
    .select('*')
    .eq('agentId', agentId)
    .order('timestamp', { ascending: true })
    .limit(10);
  
  if (historyError) {
    console.error(`Warning: Failed to get agent history: ${historyError.message}`);
  }
  
  // Get agent's prompt
  const { data: agentPrompt, error: promptError } = await supabaseClient
    .from('agent_prompts')
    .select('*')
    .eq('agent_id', agentId)
    .single();
  
  // If no custom prompt, create a default one
  const prompt = agentPrompt || {
    role: `You are an AI assistant specializing in ${agent.type} analysis for qualitative research.`,
    instructions: getDefaultInstructions(agentId)
  };
  
  // Get project data to analyze
  const { data: projectData, error: projectError } = await supabaseClient
    .from('projects')
    .select('data')
    .eq('id', projectId)
    .single();
  
  if (projectError) {
    throw new Error(`Failed to get project data: ${projectError.message}`);
  }
  
  switch (taskType) {
    case 'analyze':
      return await performAnalysis(task, agent, prompt, projectData, agentHistory, supabaseClient, openaiApiKey);
    case 'validate':
      return await performValidation(task, agent, prompt, projectData, agentHistory, supabaseClient, openaiApiKey);
    case 'collaborate':
      return await performCollaboration(task, prompt, projectData, supabaseClient, openaiApiKey);
    default:
      throw new Error(`Unknown task type: ${taskType}`);
  }
}

async function performAnalysis(
  task: AgentTask, 
  agent: any, 
  prompt: AgentPrompt, 
  projectData: any, 
  history: AgentInteraction[],
  supabaseClient: any,
  openaiApiKey: string
): Promise<any> {
  // Prepare the messages for OpenAI
  const messages = [
    { role: "system", content: `${prompt.role}\n\n${prompt.instructions}` },
    { role: "user", content: `Analyze the following qualitative data:\n\n${JSON.stringify(projectData.data, null, 2)}` }
  ];
  
  // Add history if available
  if (history && history.length > 0) {
    // Insert relevant history messages between system and user message
    history.forEach(interaction => {
      if (interaction.type === 'input') {
        messages.splice(1, 0, { role: "user", content: interaction.content });
      } else if (interaction.type === 'output') {
        messages.splice(1, 0, { role: "assistant", content: interaction.content });
      }
    });
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
  
  // Update agent with insights and completed status
  await supabaseClient
    .from('agents')
    .update({
      status: 'complete',
      insights,
      confidence: 0.85, // Could calculate this based on OpenAI's response
      updatedAt: now
    })
    .eq('id', agent.id);
  
  return {
    analysis,
    insights,
    confidence: 0.85,
    analysisCompleted: true
  };
}

async function performValidation(
  task: AgentTask, 
  agent: any, 
  prompt: AgentPrompt, 
  projectData: any, 
  history: AgentInteraction[],
  supabaseClient: any,
  openaiApiKey: string
): Promise<any> {
  // For validation, we need the original analysis
  const { data: analysisTask, error } = await supabaseClient
    .from('agent_tasks')
    .select('*')
    .eq('projectId', task.projectId)
    .eq('taskType', 'analyze')
    .eq('status', 'completed')
    .order('updatedAt', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    throw new Error(`No completed analysis found for validation: ${error.message}`);
  }
  
  // Prepare the messages for OpenAI
  const messages = [
    { role: "system", content: `${prompt.role}\n\n${prompt.instructions}` },
    { 
      role: "user", 
      content: `Validate the following analysis of qualitative data:\n\n
      Original data: ${JSON.stringify(projectData.data, null, 2)}\n\n
      Analysis to validate: ${JSON.stringify(analysisTask.output.analysis, null, 2)}` 
    }
  ];
  
  // Add history if available
  if (history && history.length > 0) {
    // Insert history after system message
    history.forEach(interaction => {
      if (interaction.type === 'input') {
        messages.splice(1, 0, { role: "user", content: interaction.content });
      } else if (interaction.type === 'output') {
        messages.splice(1, 0, { role: "assistant", content: interaction.content });
      }
    });
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
  const validation = result.choices[0].message.content;
  
  // Extract validation results
  const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: "system", content: "Extract the validation results from the text. Return a JSON object with the following structure: { validationPassed: boolean, confidence: number (between 0 and 1), issues: array of strings (empty if no issues) }" },
        { role: "user", content: validation }
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: "json_object" }
    })
  });
  
  if (!secondResponse.ok) {
    const error = await secondResponse.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }
  
  const extractionResult = await secondResponse.json();
  const validationResults = JSON.parse(extractionResult.choices[0].message.content);
  
  // Record the interaction
  const now = new Date().toISOString();
  
  // Record input
  await supabaseClient
    .from('agent_interactions')
    .insert([{
      id: crypto.randomUUID(),
      agentId: agent.id,
      timestamp: now,
      content: `Validate analysis for project ${task.projectId}`,
      type: 'input'
    }]);
  
  // Record output
  await supabaseClient
    .from('agent_interactions')
    .insert([{
      id: crypto.randomUUID(),
      agentId: agent.id,
      timestamp: now,
      content: validation,
      type: 'output'
    }]);
  
  // Record insights/issues
  if (validationResults.issues && validationResults.issues.length > 0) {
    for (const issue of validationResults.issues) {
      await supabaseClient
        .from('agent_interactions')
        .insert([{
          id: crypto.randomUUID(),
          agentId: agent.id,
          timestamp: now,
          content: issue,
          type: 'insight'
        }]);
    }
  }
  
  // Update agent with results and completed status
  await supabaseClient
    .from('agents')
    .update({
      status: 'complete',
      insights: validationResults.issues || [],
      confidence: validationResults.confidence || 0.7,
      updatedAt: now
    })
    .eq('id', agent.id);
  
  return {
    validation,
    ...validationResults
  };
}

async function performCollaboration(
  task: AgentTask, 
  prompt: AgentPrompt, 
  projectData: any, 
  supabaseClient: any,
  openaiApiKey: string
): Promise<any> {
  // This task is for collaboration between agents
  const agentIds = task.input.agents || [];
  const collaborationLevel = task.input.collaborationLevel || 0.5;
  
  // Get all completed agent tasks for this project
  const { data: agentTasks, error } = await supabaseClient
    .from('agent_tasks')
    .select('*')
    .eq('projectId', task.projectId)
    .in('agentId', agentIds)
    .eq('status', 'completed')
    .eq('taskType', 'analyze');
  
  if (error || !agentTasks || agentTasks.length === 0) {
    throw new Error(`No completed agent tasks found for collaboration: ${error?.message || 'No data'}`);
  }
  
  // Build context from all agent analyses
  let analysisContext = '';
  
  for (const agentTask of agentTasks) {
    const { data: agent } = await supabaseClient
      .from('agents')
      .select('name, type')
      .eq('id', agentTask.agentId)
      .single();
    
    analysisContext += `Analysis from ${agent?.name || agentTask.agentId} (${agent?.type || 'unknown'}):\n`;
    analysisContext += `${agentTask.output.analysis}\n\n`;
    
    if (agentTask.output.insights && agentTask.output.insights.length > 0) {
      analysisContext += `Key insights:\n`;
      agentTask.output.insights.forEach((insight: string, i: number) => {
        analysisContext += `${i+1}. ${insight}\n`;
      });
      analysisContext += '\n';
    }
  }
  
  // Prepare the messages for OpenAI
  const messages = [
    { 
      role: "system", 
      content: `You are an AI research coordinator responsible for synthesizing multiple analyses of qualitative data. 
      Your task is to create a coherent, unified analysis that integrates diverse perspectives.
      At a collaboration level of ${collaborationLevel * 100}%, you should ${
        collaborationLevel > 0.7 ? 'emphasize differences and debates between perspectives' :
        collaborationLevel > 0.4 ? 'balance consensus and differences' :
        'prioritize finding consensus and common ground'
      }.
      Extract the most valuable insights across analyses and highlight areas of agreement and disagreement.
      Your output should be structured as:
      1. Synthesis of findings
      2. Key consensus points
      3. Notable disagreements or tensions (if any)
      4. Integrated insights (the most important takeaways that combine multiple perspectives)` 
    },
    { 
      role: "user", 
      content: `Here are analyses from different research agents examining the same qualitative data. 
      Create a research synthesis that integrates these perspectives:\n\n${analysisContext}` 
    }
  ];
  
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
      temperature: 0.7,
      max_tokens: 2000,
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
  const synthesis = result.choices[0].message.content;
  
  // Extract insights from synthesis
  const insights = await extractInsightsFromAnalysis(synthesis, openaiApiKey);
  
  // Update collaboration with insights and completed status
  const now = new Date().toISOString();
  
  const { error: updateError } = await supabaseClient
    .from('agent_collaborations')
    .update({
      status: 'completed',
      insights,
      updatedAt: now
    })
    .eq('id', task.input.collaborationId);
  
  if (updateError) {
    console.error(`Warning: Failed to update collaboration: ${updateError.message}`);
  }
  
  return {
    synthesis,
    insights,
    collaborationSuccess: true,
    consensus: 0.8
  };
}

async function extractInsightsFromAnalysis(analysis: string, openaiApiKey: string): Promise<string[]> {
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
