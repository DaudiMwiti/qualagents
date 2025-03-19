
import { createClient } from '@supabase/supabase-js';

// Agent Types
export type AgentType = 'methodology' | 'theoretical' | 'validation';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  methodology?: string;
  framework?: string;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  confidence?: number;
  insights: string[];
  history?: AgentInteraction[];
}

export interface AgentTask {
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

export interface AgentCollaboration {
  id: string;
  projectId: string;
  agents: string[]; // Agent IDs
  collaborationLevel: number;
  status: 'idle' | 'active' | 'completed';
  insights: string[];
  createdAt: string;
}

export interface AgentInteraction {
  id: string;
  agentId: string;
  timestamp: string;
  content: string;
  type: 'input' | 'output' | 'insight';
  metadata?: Record<string, any>;
}

export interface AgentPrompt {
  role: string;
  methodology?: string;
  framework?: string;
  instructions: string;
  examples?: AgentInteraction[];
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Agent Service
export const agentService = {
  // Get active agents for a user
  async getUserAgents(userId: string): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('agent_settings')
        .select('active_agents')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      if (!data || !data.active_agents || data.active_agents.length === 0) {
        return [];
      }
      
      // Fetch actual agent data from the agents table
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .in('id', data.active_agents);
      
      if (agentsError) throw agentsError;
      
      // If no agent data found, create defaults based on agent IDs
      if (!agentsData || agentsData.length === 0) {
        return data.active_agents.map((agentId: string) => ({
          id: agentId,
          name: getAgentName(agentId),
          type: determineAgentType(agentId),
          status: 'idle',
          insights: []
        }));
      }
      
      return agentsData;
    } catch (error) {
      console.error('Error fetching user agents:', error);
      return [];
    }
  },
  
  // Get or create an agent
  async getOrCreateAgent(agentId: string): Promise<Agent | null> {
    try {
      // Check if agent exists
      const { data: existingAgent, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single();
      
      if (!error && existingAgent) {
        return existingAgent;
      }
      
      // Create new agent
      const newAgent: Agent = {
        id: agentId,
        name: getAgentName(agentId),
        type: determineAgentType(agentId),
        status: 'idle',
        insights: []
      };
      
      const { data, error: createError } = await supabase
        .from('agents')
        .insert([newAgent])
        .select()
        .single();
      
      if (createError) throw createError;
      
      return data;
    } catch (error) {
      console.error('Error getting or creating agent:', error);
      return null;
    }
  },
  
  // Get agent prompt
  async getAgentPrompt(agentId: string): Promise<AgentPrompt | null> {
    try {
      const { data, error } = await supabase
        .from('agent_prompts')
        .select('*')
        .eq('agent_id', agentId)
        .single();
      
      if (error) {
        // If no custom prompt exists, generate default based on agent type
        const agentType = determineAgentType(agentId);
        return {
          role: `You are an AI assistant specializing in ${agentType} analysis for qualitative research.`,
          instructions: getDefaultInstructions(agentId),
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error getting agent prompt:', error);
      return null;
    }
  },
  
  // Create a new agent task
  async createAgentTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<AgentTask | null> {
    try {
      const now = new Date().toISOString();
      const newTask = {
        ...task,
        id: crypto.randomUUID(),
        status: 'queued',
        createdAt: now,
        updatedAt: now
      };
      
      const { data, error } = await supabase
        .from('agent_tasks')
        .insert([newTask])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update agent status
      await supabase
        .from('agents')
        .update({ status: 'analyzing', updatedAt: now })
        .eq('id', task.agentId);
      
      // Trigger the task processing via edge function
      await fetch('/api/process-agent-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: data.id }),
      });
      
      return data;
    } catch (error) {
      console.error('Error creating agent task:', error);
      return null;
    }
  },
  
  // Record agent interaction
  async recordInteraction(interaction: Omit<AgentInteraction, 'id'>): Promise<AgentInteraction | null> {
    try {
      const newInteraction = {
        ...interaction,
        id: crypto.randomUUID(),
      };
      
      const { data, error } = await supabase
        .from('agent_interactions')
        .insert([newInteraction])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error recording agent interaction:', error);
      return null;
    }
  },
  
  // Get agent history
  async getAgentHistory(agentId: string, limit = 10): Promise<AgentInteraction[]> {
    try {
      const { data, error } = await supabase
        .from('agent_interactions')
        .select('*')
        .eq('agentId', agentId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting agent history:', error);
      return [];
    }
  },
  
  // Start a collaboration session between multiple agents
  async startCollaboration(projectId: string, agentIds: string[], collaborationLevel: number): Promise<AgentCollaboration | null> {
    try {
      const now = new Date().toISOString();
      const newCollaboration = {
        id: crypto.randomUUID(),
        projectId,
        agents: agentIds,
        collaborationLevel,
        status: 'idle',
        insights: [],
        createdAt: now
      };
      
      const { data, error } = await supabase
        .from('agent_collaborations')
        .insert([newCollaboration])
        .select()
        .single();
      
      if (error) throw error;
      
      // Trigger the collaboration via edge function
      await fetch('/api/start-agent-collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collaborationId: data.id }),
      });
      
      return data;
    } catch (error) {
      console.error('Error starting collaboration:', error);
      return null;
    }
  },
  
  // Subscribe to agent status updates
  subscribeToAgentUpdates(agentId: string, callback: (update: Agent) => void) {
    return supabase
      .channel(`agent-${agentId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agents',
        filter: `id=eq.${agentId}`
      }, (payload) => {
        callback(payload.new as Agent);
      })
      .subscribe();
  },
  
  // Subscribe to task status updates
  subscribeToTaskUpdates(taskId: string, callback: (update: AgentTask) => void) {
    return supabase
      .channel(`task-${taskId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_tasks',
        filter: `id=eq.${taskId}`
      }, (payload) => {
        callback(payload.new as AgentTask);
      })
      .subscribe();
  },
  
  // Subscribe to collaboration updates
  subscribeToCollaborationUpdates(collaborationId: string, callback: (update: AgentCollaboration) => void) {
    return supabase
      .channel(`collaboration-${collaborationId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_collaborations',
        filter: `id=eq.${collaborationId}`
      }, (payload) => {
        callback(payload.new as AgentCollaboration);
      })
      .subscribe();
  },
  
  // Subscribe to agent interactions
  subscribeToAgentInteractions(agentId: string, callback: (interaction: AgentInteraction) => void) {
    return supabase
      .channel(`interaction-${agentId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_interactions',
        filter: `agentId=eq.${agentId}`
      }, (payload) => {
        callback(payload.new as AgentInteraction);
      })
      .subscribe();
  }
};

// Helper function to determine agent type based on ID
function determineAgentType(agentId: string): AgentType {
  // These arrays would match what's in the AgentSettings.tsx file
  const methodologyAgents = ['grounded-theory', 'phenomenology', 'discourse-analysis', 'narrative-analysis'];
  const theoreticalAgents = ['feminist-theory', 'critical-race-theory', 'post-colonialism', 'structuralism'];
  const validationAgents = ['bias-identification', 'assumption-validation', 'triangulation', 'member-checking'];
  
  if (methodologyAgents.includes(agentId)) return 'methodology';
  if (theoreticalAgents.includes(agentId)) return 'theoretical';
  if (validationAgents.includes(agentId)) return 'validation';
  
  // Default to methodology if unknown
  return 'methodology';
}

// Helper function to get agent name from ID
function getAgentName(agentId: string): string {
  // Convert from kebab-case to title case
  return agentId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' Agent';
}

// Helper function to get default instructions
function getDefaultInstructions(agentId: string): string {
  const agentType = determineAgentType(agentId);
  
  switch (agentType) {
    case 'methodology':
      return `Analyze the qualitative data using ${getAgentName(agentId).replace(' Agent', '')} approach. 
      Focus on identifying patterns, themes, and insights that emerge from the data. 
      Explain your analysis process and provide evidence from the data to support your findings.`;
    
    case 'theoretical':
      return `Interpret the qualitative data through the lens of ${getAgentName(agentId).replace(' Agent', '')}. 
      Identify key concepts, power structures, and social dynamics evident in the data. 
      Provide a critical analysis that highlights implications for research and practice.`;
    
    case 'validation':
      return `Evaluate the quality and trustworthiness of the analysis using ${getAgentName(agentId).replace(' Agent', '')}. 
      Identify potential biases, assumptions, and limitations in the data and analysis. 
      Suggest ways to enhance rigor and credibility of the findings.`;
      
    default:
      return 'Analyze the qualitative data and provide insights based on your expertise.';
  }
}

export default agentService;
