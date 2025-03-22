
import { toast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Agent as AgentType, createSubscription } from "@/types/agent";

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  max_tokens: number;
  prompt: string;
  is_active: boolean;
  is_public: boolean;
  // Include all the other properties needed for the AgentSettings component
  is_safe_mode: boolean;
  is_streaming: boolean;
  is_context_aware: boolean;
  is_knowledge_enabled: boolean;
  is_tools_enabled: boolean;
  is_reasoning_enabled: boolean;
  is_memory_enabled: boolean;
  is_goals_enabled: boolean;
  is_constraints_enabled: boolean;
  is_self_improvement_enabled: boolean;
  is_long_term_planning_enabled: boolean;
  is_multi_agent_collaboration_enabled: boolean;
  is_emotional_intelligence_enabled: boolean;
  is_ethical_framework_enabled: boolean;
  is_creativity_enhancement_enabled: boolean;
  is_critical_thinking_enhancement_enabled: boolean;
  is_learning_from_feedback_enabled: boolean;
  is_complex_problem_solving_enabled: boolean;
  is_decision_making_enabled: boolean;
  is_risk_assessment_enabled: boolean;
  is_resource_management_enabled: boolean;
  is_time_management_enabled: boolean;
  is_communication_skills_enabled: boolean;
  is_negotiation_skills_enabled: boolean;
  is_leadership_skills_enabled: boolean;
  is_teamwork_skills_enabled: boolean;
  is_adaptability_skills_enabled: boolean;
  is_stress_management_skills_enabled: boolean;
  is_conflict_resolution_skills_enabled: boolean;
  is_cultural_sensitivity_skills_enabled: boolean;
  is_emotional_regulation_skills_enabled: boolean;
  is_empathy_skills_enabled: boolean;
  is_social_awareness_skills_enabled: boolean;
  is_self_awareness_skills_enabled: boolean;
  is_self_regulation_skills_enabled: boolean;
  is_motivation_skills_enabled: boolean;
  is_resilience_skills_enabled: boolean;
  is_optimism_skills_enabled: boolean;
  is_curiosity_skills_enabled: boolean;
  is_open_mindedness_skills_enabled: boolean;
  is_humility_skills_enabled: boolean;
  is_gratitude_skills_enabled: boolean;
  is_forgiveness_skills_enabled: boolean;
  is_compassion_skills_enabled: boolean;
  is_kindness_skills_enabled: boolean;
  is_generosity_skills_enabled: boolean;
  is_service_skills_enabled: boolean;
  is_justice_skills_enabled: boolean;
  is_courage_skills_enabled: boolean;
  is_perseverance_skills_enabled: boolean;
  is_patience_skills_enabled: boolean;
  is_honesty_skills_enabled: boolean;
  is_integrity_skills_enabled: boolean;
  is_responsibility_skills_enabled: boolean;
  is_accountability_skills_enabled: boolean;
  is_loyalty_skills_enabled: boolean;
  is_respect_skills_enabled: boolean;
  is_tolerance_skills_enabled: boolean;
  is_acceptance_skills_enabled: boolean;
  is_inclusivity_skills_enabled: boolean;
  is_diversity_skills_enabled: boolean;
  is_equity_skills_enabled: boolean;
  is_belonging_skills_enabled: boolean;
  is_wellbeing_skills_enabled: boolean;
  is_happiness_skills_enabled: boolean;
  is_fulfillment_skills_enabled: boolean;
  is_meaning_skills_enabled: boolean;
  is_purpose_skills_enabled: boolean;
  is_legacy_skills_enabled: boolean;
  is_impact_skills_enabled: boolean;
  is_transformation_skills_enabled: boolean;
  is_growth_skills_enabled: boolean;
  is_learning_skills_enabled: boolean;
  is_development_skills_enabled: boolean;
  is_improvement_skills_enabled: boolean;
  is_progress_skills_enabled: boolean;
  is_success_skills_enabled: boolean;
  is_achievement_skills_enabled: boolean;
  is_recognition_skills_enabled: boolean;
  is_appreciation_skills_enabled: boolean;
  is_celebration_skills_enabled: boolean;
  is_joy_skills_enabled: boolean;
  is_peace_skills_enabled: boolean;
  is_love_skills_enabled: boolean;
  is_hope_skills_enabled: boolean;
  is_faith_skills_enabled: boolean;
  is_charity_skills_enabled: boolean;
  is_virtue_skills_enabled: boolean;
  is_goodness_skills_enabled: boolean;
  is_truth_skills_enabled: boolean;
  is_beauty_skills_enabled: boolean;
  is_wisdom_skills_enabled: boolean;
  is_knowledge_skills_enabled: boolean;
  is_understanding_skills_enabled: boolean;
  is_insight_skills_enabled: boolean;
  is_intuition_skills_enabled: boolean;
  is_imagination_skills_enabled: boolean;
  is_creativity_skills_enabled: boolean;
  is_innovation_skills_enabled: boolean;
  is_originality_skills_enabled: boolean;
  is_vision_skills_enabled: boolean;
  is_strategy_skills_enabled: boolean;
  is_planning_skills_enabled: boolean;
  is_organization_skills_enabled: boolean;
  is_execution_skills_enabled: boolean;
  is_monitoring_skills_enabled: boolean;
  is_evaluation_skills_enabled: boolean;
  is_adaptationSkillsEnabled: boolean;
  
  // Additional properties from AgentType interface
  type?: string;
  status?: 'idle' | 'analyzing' | 'complete' | 'error';
  insights?: string[];
  methodology?: string;
  framework?: string;
  confidence?: number;
  persona?: {
    id: string;
    name: string;
    description: string;
    traits: string[];
    avatar?: string;
  };
  pinnedMethodologies?: string[];
}

class AgentService {
  async getAgents(supabase?: any) {
    try {
      // This is a mock implementation - in a real app, you'd query Supabase
      return [
        {
          id: "grounded-theory",
          name: "Grounded Theory Agent",
          description: "Identifies patterns and concepts in qualitative data",
          is_active: true,
          is_public: true,
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          max_tokens: 200,
          prompt: "Analyze the following qualitative data using grounded theory principles...",
          // Type properties
          type: "methodology",
          methodology: "Grounded Theory",
          status: "complete" as const,
          insights: [
            "Common themes include privacy concerns across demographic groups.",
            "Emergent pattern of trust issues with automated systems.",
            "Theoretical saturation reached in core trust-building category."
          ],
          confidence: 0.89,
          // Include all the other properties needed for the AgentSettings component
          is_safe_mode: true,
          is_streaming: false,
          is_context_aware: true,
          is_knowledge_enabled: true,
          is_tools_enabled: true,
          is_reasoning_enabled: true,
          is_memory_enabled: true,
          is_goals_enabled: true,
          is_constraints_enabled: true,
          is_self_improvement_enabled: true,
          is_long_term_planning_enabled: true,
          is_multi_agent_collaboration_enabled: true,
          is_emotional_intelligence_enabled: true,
          is_ethical_framework_enabled: true,
          is_creativity_enhancement_enabled: true,
          is_critical_thinking_enhancement_enabled: true,
          is_learning_from_feedback_enabled: true,
          is_complex_problem_solving_enabled: true,
          is_decision_making_enabled: true,
          is_risk_assessment_enabled: true,
          is_resource_management_enabled: true,
          is_time_management_enabled: true,
          is_communication_skills_enabled: true,
          is_negotiation_skills_enabled: true,
          is_leadership_skills_enabled: true,
          is_teamwork_skills_enabled: true,
          is_adaptability_skills_enabled: true,
          is_stress_management_skills_enabled: true,
          is_conflict_resolution_skills_enabled: true,
          is_cultural_sensitivity_skills_enabled: true,
          is_emotional_regulation_skills_enabled: true,
          is_empathy_skills_enabled: true,
          is_social_awareness_skills_enabled: true,
          is_self_awareness_skills_enabled: true,
          is_self_regulation_skills_enabled: true,
          is_motivation_skills_enabled: true,
          is_resilience_skills_enabled: true,
          is_optimism_skills_enabled: true,
          is_curiosity_skills_enabled: true,
          is_open_mindedness_skills_enabled: true,
          is_humility_skills_enabled: true,
          is_gratitude_skills_enabled: true,
          is_forgiveness_skills_enabled: true,
          is_compassion_skills_enabled: true,
          is_kindness_skills_enabled: true,
          is_generosity_skills_enabled: true,
          is_service_skills_enabled: true,
          is_justice_skills_enabled: true,
          is_courage_skills_enabled: true,
          is_perseverance_skills_enabled: true,
          is_patience_skills_enabled: true,
          is_honesty_skills_enabled: true,
          is_integrity_skills_enabled: true,
          is_responsibility_skills_enabled: true,
          is_accountability_skills_enabled: true,
          is_loyalty_skills_enabled: true,
          is_respect_skills_enabled: true,
          is_tolerance_skills_enabled: true,
          is_acceptance_skills_enabled: true,
          is_inclusivity_skills_enabled: true,
          is_diversity_skills_enabled: true,
          is_equity_skills_enabled: true,
          is_belonging_skills_enabled: true,
          is_wellbeing_skills_enabled: true,
          is_happiness_skills_enabled: true,
          is_fulfillment_skills_enabled: true,
          is_meaning_skills_enabled: true,
          is_purpose_skills_enabled: true,
          is_legacy_skills_enabled: true,
          is_impact_skills_enabled: true,
          is_transformation_skills_enabled: true,
          is_growth_skills_enabled: true,
          is_learning_skills_enabled: true,
          is_development_skills_enabled: true,
          is_improvement_skills_enabled: true,
          is_progress_skills_enabled: true,
          is_success_skills_enabled: true,
          is_achievement_skills_enabled: true,
          is_recognition_skills_enabled: true,
          is_appreciation_skills_enabled: true,
          is_celebration_skills_enabled: true,
          is_joy_skills_enabled: true,
          is_peace_skills_enabled: true,
          is_love_skills_enabled: true,
          is_hope_skills_enabled: true,
          is_faith_skills_enabled: true,
          is_charity_skills_enabled: true,
          is_virtue_skills_enabled: true,
          is_goodness_skills_enabled: true,
          is_truth_skills_enabled: true,
          is_beauty_skills_enabled: true,
          is_wisdom_skills_enabled: true,
          is_knowledge_skills_enabled: true,
          is_understanding_skills_enabled: true,
          is_insight_skills_enabled: true,
          is_intuition_skills_enabled: true,
          is_imagination_skills_enabled: true,
          is_creativity_skills_enabled: true,
          is_innovation_skills_enabled: true,
          is_originality_skills_enabled: true,
          is_vision_skills_enabled: true,
          is_strategy_skills_enabled: true,
          is_planning_skills_enabled: true,
          is_organization_skills_enabled: true,
          is_execution_skills_enabled: true,
          is_monitoring_skills_enabled: true,
          is_evaluation_skills_enabled: true,
          is_adaptationSkillsEnabled: true,
        }
        // Add more mock agents as needed
      ];
    } catch (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
  }

  // Add method to save InsightFeedback
  async saveInsightFeedback(feedback: any) {
    try {
      // Mock implementation - would save to database in real app
      console.log("Saving insight feedback:", feedback);
      return { success: true };
    } catch (error) {
      console.error("Error saving insight feedback:", error);
      throw error;
    }
  }

  // Add missing methods
  async getUserAgents(userId: string) {
    try {
      // Mock implementation
      console.log(`Getting agents for user: ${userId}`);
      return this.getAgents();
    } catch (error) {
      console.error("Error getting user agents:", error);
      throw error;
    }
  }

  subscribeToAgentUpdates(agentId: string, callback: (agent: any) => void) {
    console.log(`Subscribing to updates for agent: ${agentId}`);
    // Mock implementation - return a subscription object
    return createSubscription(() => {
      console.log(`Unsubscribed from agent updates: ${agentId}`);
    });
  }

  subscribeToAgentInteractions(agentId: string, callback: (interaction: any) => void) {
    console.log(`Subscribing to interactions for agent: ${agentId}`);
    // Mock implementation - return a subscription object
    return createSubscription(() => {
      console.log(`Unsubscribed from agent interactions: ${agentId}`);
    });
  }

  async startCollaboration(projectId: string, agentIds: string[], temperature: number) {
    console.log(`Starting collaboration for project ${projectId} with agents ${agentIds.join(', ')} at temperature ${temperature}`);
    // Mock implementation
    return { success: true };
  }

  getPersonas() {
    // Mock implementation
    return [
      {
        id: "feminist-researcher",
        name: "Feminist Researcher",
        description: "Focuses on power dynamics, gender biases, and structural inequalities in data.",
        traits: ["Critical", "Intersectional", "Equity-focused"]
      },
      {
        id: "grounded-theorist",
        name: "Grounded Theorist",
        description: "Builds theory inductively from data without preconceived hypotheses.",
        traits: ["Open-minded", "Systematic", "Iterative"]
      },
      {
        id: "phenomenologist",
        name: "Phenomenologist",
        description: "Explores lived experiences and subjective interpretations of phenomena.",
        traits: ["Empathetic", "Descriptive", "Experiential"]
      }
    ];
  }

  getMethodologies() {
    // Mock implementation
    return [
      {
        id: "grounded-theory",
        name: "Grounded Theory",
        description: "Systematic generation of theory from data."
      },
      {
        id: "phenomenology",
        name: "Phenomenology",
        description: "Study of experience and consciousness."
      },
      {
        id: "discourse-analysis",
        name: "Discourse Analysis",
        description: "Analysis of language and communication patterns."
      },
      {
        id: "narrative-analysis",
        name: "Narrative Analysis",
        description: "Focus on stories and storytelling elements."
      }
    ];
  }

  async createCustomAgent(agentData: any) {
    console.log("Creating custom agent:", agentData);
    // Mock implementation
    return {
      id: `custom-${Date.now()}`,
      ...agentData,
      status: 'idle' as const,
      insights: []
    };
  }

  async updateAgent(agentId: string, agentData: any) {
    console.log(`Updating agent ${agentId}:`, agentData);
    // Mock implementation
    return {
      id: agentId,
      ...agentData
    };
  }

  async createAgent(agentData: any) {
    console.log("Creating agent:", agentData);
    // Mock implementation
    return {
      id: `new-${Date.now()}`,
      ...agentData,
      status: 'idle' as const,
      insights: []
    };
  }

  async deleteAgent(agentId: string) {
    console.log(`Deleting agent: ${agentId}`);
    // Mock implementation
    return { success: true };
  }

  async getAll() {
    return this.getAgents();
  }
}

export const agentService = new AgentService();
