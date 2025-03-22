
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
  
  // Properties from agentService.ts Agent interface
  description: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  is_public: boolean;
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
