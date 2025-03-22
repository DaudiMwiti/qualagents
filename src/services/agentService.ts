
import { Agent, createSubscription } from '@/types/agent';
import { dataService } from './dataService';
import { agentCustomizationService } from './agentCustomizationService';
import { feedbackService } from './feedbackService';
import { Subscription } from 'zen-observable-ts';

// Mock agent service implementation
class AgentService {
  async getUserAgents(userId: string): Promise<Agent[]> {
    console.log(`Fetching agents for user ${userId}`);
    // In a real implementation, this would fetch from a database
    return Promise.resolve([]);
  }
  
  subscribeToAgentUpdates(agentId: string, callback: (agent: Agent) => void): Subscription {
    console.log(`Subscribing to updates for agent ${agentId}`);
    // In a real implementation, this would set up a WebSocket or similar
    return createSubscription(() => {
      console.log(`Unsubscribed from agent ${agentId}`);
    });
  }
  
  subscribeToAgentInteractions(
    agentId: string, 
    callback: (interaction: { type: string; content: string }) => void
  ): Subscription {
    console.log(`Subscribing to interactions for agent ${agentId}`);
    // In a real implementation, this would set up a WebSocket or similar
    return createSubscription(() => {
      console.log(`Unsubscribed from agent interactions ${agentId}`);
    });
  }
  
  // Delegating methods to specific services
  
  // Customization methods
  async updateAgentPrompt(agentId: string, prompt: string): Promise<Agent> {
    return agentCustomizationService.updateAgentPrompt(agentId, prompt);
  }
  
  async assignPersona(agentId: string, personaId: string): Promise<Agent> {
    const personas = this.getPersonas();
    return agentCustomizationService.assignPersona(agentId, personaId, personas);
  }
  
  async pinMethodology(agentId: string, methodologyId: string): Promise<Agent> {
    return agentCustomizationService.pinMethodology(agentId, methodologyId);
  }
  
  async unpinMethodology(agentId: string, methodologyId: string): Promise<Agent> {
    return agentCustomizationService.unpinMethodology(agentId, methodologyId);
  }
  
  async createCustomAgent(agent: Partial<Agent>): Promise<Agent> {
    return agentCustomizationService.createCustomAgent(agent);
  }
  
  // Feedback and collaboration methods
  async saveInsightFeedback(feedback: any): Promise<void> {
    return feedbackService.saveInsightFeedback(feedback);
  }
  
  async startCollaboration(
    projectId: string,
    agentIds: string[],
    collaborationLevel: number
  ): Promise<void> {
    return feedbackService.startCollaboration(projectId, agentIds, collaborationLevel);
  }
  
  // Data methods
  getPersonas() {
    return dataService.getPersonas();
  }
  
  getMethodologies() {
    return dataService.getMethodologies();
  }
}

export const agentService = new AgentService();

// Re-export types from agent.ts for backward compatibility
export type { Agent, AgentPersona, InsightFeedback } from '@/types/agent';
