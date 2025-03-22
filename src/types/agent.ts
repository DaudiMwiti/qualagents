
import { Subscription } from 'zen-observable-ts';

// Define Agent type
export interface Agent {
  id: string;
  name: string;
  type: string;
  methodology?: string;
  framework?: string;
  confidence?: number;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  insights: string[];
  prompt?: string;
  persona?: AgentPersona;
  pinnedMethodologies?: string[];
}

export interface AgentPersona {
  id: string;
  name: string;
  description: string;
  traits: string[];
  avatar?: string;
}

export interface InsightFeedback {
  insightId?: string;
  agentId: string;
  insight: string;
  rating: 'positive' | 'negative' | null;
  comment: string;
}

// Create a proper subscription object that matches the zen-observable-ts interface
export const createSubscription = (cleanup: () => void): Subscription => {
  return {
    closed: false,
    unsubscribe: cleanup
  };
};
