
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
      
      // Return mock agents for now, but in future we'd fetch actual agent data
      return data.active_agents.map((agentId: string) => ({
        id: agentId,
        name: agentId, // This would come from a lookup based on agentId
        type: determineAgentType(agentId),
        status: 'idle',
        insights: []
      }));
    } catch (error) {
      console.error('Error fetching user agents:', error);
      return [];
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
  subscribeToAgentUpdates(agentId: string, callback: (update: any) => void) {
    return supabase
      .channel(`agent-${agentId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agents',
        filter: `id=eq.${agentId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  },
  
  // Subscribe to task status updates
  subscribeToTaskUpdates(taskId: string, callback: (update: any) => void) {
    return supabase
      .channel(`task-${taskId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_tasks',
        filter: `id=eq.${taskId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  },
  
  // Subscribe to collaboration updates
  subscribeToCollaborationUpdates(collaborationId: string, callback: (update: any) => void) {
    return supabase
      .channel(`collaboration-${collaborationId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_collaborations',
        filter: `id=eq.${collaborationId}`
      }, (payload) => {
        callback(payload.new);
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

export default agentService;
