
import { Agent, AgentPersona } from '@/types/agent';

export class AgentCustomizationService {
  // Helper method to create a base agent with all required properties
  private createBaseAgent(): Agent {
    return {
      id: `custom-${Date.now()}`,
      name: "Custom Agent",
      type: "custom",
      description: "A customizable research agent",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 200,
      is_active: true,
      is_public: false,
      is_safe_mode: true,
      is_streaming: false,
      is_context_aware: true,
      is_knowledge_enabled: true,
      is_tools_enabled: false,
      is_reasoning_enabled: true,
      is_memory_enabled: true,
      is_goals_enabled: false,
      is_constraints_enabled: false,
      is_self_improvement_enabled: false,
      is_long_term_planning_enabled: false,
      is_multi_agent_collaboration_enabled: false,
      is_emotional_intelligence_enabled: false,
      is_ethical_framework_enabled: true,
      is_creativity_enhancement_enabled: false,
      is_critical_thinking_enhancement_enabled: true,
      is_learning_from_feedback_enabled: true,
      is_complex_problem_solving_enabled: false,
      is_decision_making_enabled: false,
      is_risk_assessment_enabled: false,
      is_resource_management_enabled: false,
      is_time_management_enabled: false,
      is_communication_skills_enabled: true,
      is_negotiation_skills_enabled: false,
      is_leadership_skills_enabled: false,
      is_teamwork_skills_enabled: false,
      is_adaptability_skills_enabled: true,
      is_stress_management_skills_enabled: false,
      is_conflict_resolution_skills_enabled: false,
      is_cultural_sensitivity_skills_enabled: true,
      is_emotional_regulation_skills_enabled: false,
      is_empathy_skills_enabled: true,
      is_social_awareness_skills_enabled: false,
      is_self_awareness_skills_enabled: true,
      is_self_regulation_skills_enabled: false,
      is_motivation_skills_enabled: false,
      is_resilience_skills_enabled: false,
      is_optimism_skills_enabled: false,
      is_curiosity_skills_enabled: true,
      is_open_mindedness_skills_enabled: true,
      is_humility_skills_enabled: false,
      is_gratitude_skills_enabled: false,
      is_forgiveness_skills_enabled: false,
      is_compassion_skills_enabled: true,
      is_kindness_skills_enabled: true,
      is_generosity_skills_enabled: false,
      is_service_skills_enabled: false,
      is_justice_skills_enabled: false,
      is_courage_skills_enabled: false,
      is_perseverance_skills_enabled: false,
      is_patience_skills_enabled: false,
      is_honesty_skills_enabled: true,
      is_integrity_skills_enabled: true,
      is_responsibility_skills_enabled: false,
      is_accountability_skills_enabled: false,
      is_loyalty_skills_enabled: false,
      is_respect_skills_enabled: true,
      is_tolerance_skills_enabled: true,
      is_acceptance_skills_enabled: false,
      is_inclusivity_skills_enabled: true,
      is_diversity_skills_enabled: true,
      is_equity_skills_enabled: false,
      is_belonging_skills_enabled: false,
      is_wellbeing_skills_enabled: false,
      is_happiness_skills_enabled: false,
      is_fulfillment_skills_enabled: false,
      is_meaning_skills_enabled: false,
      is_purpose_skills_enabled: false,
      is_legacy_skills_enabled: false,
      is_impact_skills_enabled: false,
      is_transformation_skills_enabled: false,
      is_growth_skills_enabled: true,
      is_learning_skills_enabled: true,
      is_development_skills_enabled: false,
      is_improvement_skills_enabled: true,
      is_progress_skills_enabled: false,
      is_success_skills_enabled: false,
      is_achievement_skills_enabled: false,
      is_recognition_skills_enabled: false,
      is_appreciation_skills_enabled: false,
      is_celebration_skills_enabled: false,
      is_joy_skills_enabled: false,
      is_peace_skills_enabled: false,
      is_love_skills_enabled: false,
      is_hope_skills_enabled: false,
      is_faith_skills_enabled: false,
      is_charity_skills_enabled: false,
      is_virtue_skills_enabled: false,
      is_goodness_skills_enabled: false,
      is_truth_skills_enabled: true,
      is_beauty_skills_enabled: false,
      is_wisdom_skills_enabled: true,
      is_knowledge_skills_enabled: true,
      is_understanding_skills_enabled: true,
      is_insight_skills_enabled: true,
      is_intuition_skills_enabled: false,
      is_imagination_skills_enabled: false,
      is_creativity_skills_enabled: true,
      is_innovation_skills_enabled: false,
      is_originality_skills_enabled: false,
      is_vision_skills_enabled: false,
      is_strategy_skills_enabled: false,
      is_planning_skills_enabled: false,
      is_organization_skills_enabled: false,
      is_execution_skills_enabled: false,
      is_monitoring_skills_enabled: false,
      is_evaluation_skills_enabled: true,
      is_adaptationSkillsEnabled: true,
      status: "idle",
      insights: []
    };
  }

  async updateAgentPrompt(agentId: string, prompt: string): Promise<Agent> {
    console.log(`Updating prompt for agent ${agentId}`);
    console.log(`New prompt: ${prompt}`);
    
    // Create a base agent and override specific properties
    const updatedAgent: Agent = {
      ...this.createBaseAgent(),
      id: agentId,
      prompt
    };
    
    return Promise.resolve(updatedAgent);
  }
  
  async assignPersona(agentId: string, personaId: string, personas: AgentPersona[]): Promise<Agent> {
    console.log(`Assigning persona ${personaId} to agent ${agentId}`);
    
    const persona = personas.find(p => p.id === personaId);
    
    // Create a base agent and override specific properties
    const updatedAgent: Agent = {
      ...this.createBaseAgent(),
      id: agentId,
      name: persona?.name || "Custom Agent",
      persona
    };
    
    return Promise.resolve(updatedAgent);
  }
  
  async pinMethodology(agentId: string, methodologyId: string): Promise<Agent> {
    console.log(`Pinning methodology ${methodologyId} to agent ${agentId}`);
    
    // Create a base agent and override specific properties
    const updatedAgent: Agent = {
      ...this.createBaseAgent(),
      id: agentId,
      methodology: methodologyId,
      pinnedMethodologies: [methodologyId]
    };
    
    return Promise.resolve(updatedAgent);
  }
  
  async unpinMethodology(agentId: string, methodologyId: string): Promise<Agent> {
    console.log(`Unpinning methodology ${methodologyId} from agent ${agentId}`);
    
    // Create a base agent and override specific properties
    const updatedAgent: Agent = {
      ...this.createBaseAgent(),
      id: agentId,
      pinnedMethodologies: []
    };
    
    return Promise.resolve(updatedAgent);
  }
  
  async createCustomAgent(agent: Partial<Agent>): Promise<Agent> {
    console.log(`Creating custom agent:`, agent);
    
    // Create a new agent by merging the base agent with the provided properties
    const newAgent: Agent = {
      ...this.createBaseAgent(),
      ...agent,
      id: agent.id || `custom-${Date.now()}`
    };
    
    return Promise.resolve(newAgent);
  }
}

export const agentCustomizationService = new AgentCustomizationService();
