import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit,
  FileCog,
  FolderOpen,
  LucideBot,
  MessageSquareWarning,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Terminal,
  Trash,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import AgentVisualizer from "@/components/project/AgentVisualizer";
import { agentService } from "@/services/agentService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AgentSettings = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDescription, setNewAgentDescription] = useState("");
  const [newAgentModel, setNewAgentModel] = useState("gpt-3.5-turbo");
  const [newAgentTemperature, setNewAgentTemperature] = useState(0.7);
  const [newAgentMaxTokens, setNewAgentMaxTokens] = useState(200);
  const [newAgentPrompt, setNewAgentPrompt] = useState("");
  const [isAgentActive, setIsAgentActive] = useState(true);
  const [isAgentPublic, setIsAgentPublic] = useState(false);
  const [isAgentSafeMode, setIsAgentSafeMode] = useState(true);
  const [isAgentStreaming, setIsAgentStreaming] = useState(false);
  const [isAgentContextAware, setIsAgentContextAware] = useState(true);
  const [isAgentKnowledgeEnabled, setIsAgentKnowledgeEnabled] = useState(true);
  const [isAgentToolsEnabled, setIsAgentToolsEnabled] = useState(true);
  const [isAgentReasoningEnabled, setIsAgentReasoningEnabled] = useState(true);
  const [isAgentMemoryEnabled, setIsAgentMemoryEnabled] = useState(true);
  const [isAgentGoalsEnabled, setIsAgentGoalsEnabled] = useState(true);
  const [isAgentConstraintsEnabled, setIsAgentConstraintsEnabled] = useState(true);
  const [isAgentSelfImprovementEnabled, setIsAgentSelfImprovementEnabled] = useState(true);
  const [isAgentLongTermPlanningEnabled, setIsAgentLongTermPlanningEnabled] = useState(true);
  const [isAgentMultiAgentCollaborationEnabled, setIsAgentMultiAgentCollaborationEnabled] = useState(true);
  const [isAgentEmotionalIntelligenceEnabled, setIsAgentEmotionalIntelligenceEnabled] = useState(true);
  const [isAgentEthicalFrameworkEnabled, setIsAgentEthicalFrameworkEnabled] = useState(true);
  const [isAgentCreativityEnhancementEnabled, setIsAgentCreativityEnhancementEnabled] = useState(true);
  const [isAgentCriticalThinkingEnhancementEnabled, setIsAgentCriticalThinkingEnhancementEnabled] = useState(true);
  const [isAgentLearningFromFeedbackEnabled, setIsAgentLearningFromFeedbackEnabled] = useState(true);
  const [isAgentComplexProblemSolvingEnabled, setIsAgentComplexProblemSolvingEnabled] = useState(true);
  const [isAgentDecisionMakingEnabled, setIsAgentDecisionMakingEnabled] = useState(true);
  const [isAgentRiskAssessmentEnabled, setIsAgentRiskAssessmentEnabled] = useState(true);
  const [isAgentResourceManagementEnabled, setIsAgentResourceManagementEnabled] = useState(true);
  const [isAgentTimeManagementEnabled, setIsAgentTimeManagementEnabled] = useState(true);
  const [isAgentCommunicationSkillsEnabled, setIsAgentCommunicationSkillsEnabled] = useState(true);
  const [isAgentNegotiationSkillsEnabled, setIsAgentNegotiationSkillsEnabled] = useState(true);
  const [isAgentLeadershipSkillsEnabled, setIsAgentLeadershipSkillsEnabled] = useState(true);
  const [isAgentTeamworkSkillsEnabled, setIsAgentTeamworkSkillsEnabled] = useState(true);
  const [isAgentAdaptabilitySkillsEnabled, setIsAgentAdaptabilitySkillsEnabled] = useState(true);
  const [isAgentStressManagementSkillsEnabled, setIsAgentStressManagementSkillsEnabled] = useState(true);
  const [isAgentConflictResolutionSkillsEnabled, setIsAgentConflictResolutionSkillsEnabled] = useState(true);
  const [isAgentCulturalSensitivitySkillsEnabled, setIsAgentCulturalSensitivitySkillsEnabled] = useState(true);
  const [isAgentEmotionalRegulationSkillsEnabled, setIsAgentEmotionalRegulationSkillsEnabled] = useState(true);
  const [isAgentEmpathySkillsEnabled, setIsAgentEmpathySkillsEnabled] = useState(true);
  const [isAgentSocialAwarenessSkillsEnabled, setIsAgentSocialAwarenessSkillsEnabled] = useState(true);
  const [isAgentSelfAwarenessSkillsEnabled, setIsAgentSelfAwarenessSkillsEnabled] = useState(true);
  const [isAgentSelfRegulationSkillsEnabled, setIsAgentSelfRegulationSkillsEnabled] = useState(true);
  const [isAgentMotivationSkillsEnabled, setIsAgentMotivationSkillsEnabled] = useState(true);
  const [isAgentResilienceSkillsEnabled, setIsAgentResilienceSkillsEnabled] = useState(true);
  const [isAgentOptimismSkillsEnabled, setIsAgentOptimismSkillsEnabled] = useState(true);
  const [isAgentCuriositySkillsEnabled, setIsAgentCuriositySkillsEnabled] = useState(true);
  const [isAgentOpenMindednessSkillsEnabled, setIsAgentOpenMindednessSkillsEnabled] = useState(true);
  const [isAgentHumilitySkillsEnabled, setIsAgentHumilitySkillsEnabled] = useState(true);
  const [isAgentGratitudeSkillsEnabled, setIsAgentGratitudeSkillsEnabled] = useState(true);
  const [isAgentForgivenessSkillsEnabled, setIsAgentForgivenessSkillsEnabled] = useState(true);
  const [isAgentCompassionSkillsEnabled, setIsAgentCompassionSkillsEnabled] = useState(true);
  const [isAgentKindnessSkillsEnabled, setIsAgentKindnessSkillsEnabled] = useState(true);
  const [isAgentGenerositySkillsEnabled, setIsAgentGenerositySkillsEnabled] = useState(true);
  const [isAgentServiceSkillsEnabled, setIsAgentServiceSkillsEnabled] = useState(true);
  const [isAgentJusticeSkillsEnabled, setIsAgentJusticeSkillsEnabled] = useState(true);
  const [isAgentCourageSkillsEnabled, setIsAgentCourageSkillsEnabled] = useState(true);
  const [isAgentPerseveranceSkillsEnabled, setIsAgentPerseveranceSkillsEnabled] = useState(true);
  const [isAgentPatienceSkillsEnabled, setIsAgentPatienceSkillsEnabled] = useState(true);
  const [isAgentHonestySkillsEnabled, setIsAgentHonestySkillsEnabled] = useState(true);
  const [isAgentIntegritySkillsEnabled, setIsAgentIntegritySkillsEnabled] = useState(true);
  const [isAgentResponsibilitySkillsEnabled, setIsAgentResponsibilitySkillsEnabled] = useState(true);
  const [isAgentAccountabilitySkillsEnabled, setIsAgentAccountabilitySkillsEnabled] = useState(true);
  const [isAgentLoyaltySkillsEnabled, setIsAgentLoyaltySkillsEnabled] = useState(true);
  const [isAgentRespectSkillsEnabled, setIsAgentRespectSkillsEnabled] = useState(true);
  const [isAgentToleranceSkillsEnabled, setIsAgentToleranceSkillsEnabled] = useState(true);
  const [isAgentAcceptanceSkillsEnabled, setIsAgentAcceptanceSkillsEnabled] = useState(true);
  const [isAgentInclusivitySkillsEnabled, setIsAgentInclusivitySkillsEnabled] = useState(true);
  const [isAgentDiversitySkillsEnabled, setIsAgentDiversitySkillsEnabled] = useState(true);
  const [isAgentEquitySkillsEnabled, setIsAgentEquitySkillsEnabled] = useState(true);
  const [isAgentBelongingSkillsEnabled, setIsAgentBelongingSkillsEnabled] = useState(true);
  const [isAgentWellbeingSkillsEnabled, setIsAgentWellbeingSkillsEnabled] = useState(true);
  const [isAgentHappinessSkillsEnabled, setIsAgentHappinessSkillsEnabled] = useState(true);
  const [isAgentFulfillmentSkillsEnabled, setIsAgentFulfillmentSkillsEnabled] = useState(true);
  const [isAgentMeaningSkillsEnabled, setIsAgentMeaningSkillsEnabled] = useState(true);
  const [isAgentPurposeSkillsEnabled, setIsAgentPurposeSkillsEnabled] = useState(true);
  const [isAgentLegacySkillsEnabled, setIsAgentLegacySkillsEnabled] = useState(true);
  const [isAgentImpactSkillsEnabled, setIsAgentImpactSkillsEnabled] = useState(true);
  const [isAgentTransformationSkillsEnabled, setIsAgentTransformationSkillsEnabled] = useState(true);
  const [isAgentGrowthSkillsEnabled, setIsAgentGrowthSkillsEnabled] = useState(true);
  const [isAgentLearningSkillsEnabled, setIsAgentLearningSkillsEnabled] = useState(true);
  const [isAgentDevelopmentSkillsEnabled, setIsAgentDevelopmentSkillsEnabled] = useState(true);
  const [isAgentImprovementSkillsEnabled, setIsAgentImprovementSkillsEnabled] = useState(true);
  const [isAgentProgressSkillsEnabled, setIsAgentProgressSkillsEnabled] = useState(true);
  const [isAgentSuccessSkillsEnabled, setIsAgentSuccessSkillsEnabled] = useState(true);
  const [isAgentAchievementSkillsEnabled, setIsAgentAchievementSkillsEnabled] = useState(true);
  const [isAgentRecognitionSkillsEnabled, setIsAgentRecognitionSkillsEnabled] = useState(true);
  const [isAgentAppreciationSkillsEnabled, setIsAgentAppreciationSkillsEnabled] = useState(true);
  const [isAgentCelebrationSkillsEnabled, setIsAgentCelebrationSkillsEnabled] = useState(true);
  const [isAgentJoySkillsEnabled, setIsAgentJoySkillsEnabled] = useState(true);
  const [isAgentPeaceSkillsEnabled, setIsAgentPeaceSkillsEnabled] = useState(true);
  const [isAgentLoveSkillsEnabled, setIsAgentLoveSkillsEnabled] = useState(true);
  const [isAgentHopeSkillsEnabled, setIsAgentHopeSkillsEnabled] = useState(true);
  const [isAgentFaithSkillsEnabled, setIsAgentFaithSkillsEnabled] = useState(true);
  const [isAgentCharitySkillsEnabled, setIsAgentCharitySkillsEnabled] = useState(true);
  const [isAgentVirtueSkillsEnabled, setIsAgentVirtueSkillsEnabled] = useState(true);
  const [isAgentGoodnessSkillsEnabled, setIsAgentGoodnessSkillsEnabled] = useState(true);
  const [isAgentTruthSkillsEnabled, setIsAgentTruthSkillsEnabled] = useState(true);
  const [isAgentBeautySkillsEnabled, setIsAgentBeautySkillsEnabled] = useState(true);
  const [isAgentWisdomSkillsEnabled, setIsAgentWisdomSkillsEnabled] = useState(true);
  const [isAgentKnowledgeSkillsEnabled, setIsAgentKnowledgeSkillsEnabled] = useState(true);
  const [isAgentUnderstandingSkillsEnabled, setIsAgentUnderstandingSkillsEnabled] = useState(true);
  const [isAgentInsightSkillsEnabled, setIsAgentInsightSkillsEnabled] = useState(true);
  const [isAgentIntuitionSkillsEnabled, setIsAgentIntuitionSkillsEnabled] = useState(true);
  const [isAgentImaginationSkillsEnabled, setIsAgentImaginationSkillsEnabled] = useState(true);
  const [isAgentCreativitySkillsEnabled, setIsAgentCreativitySkillsEnabled] = useState(true);
  const [isAgentInnovationSkillsEnabled, setIsAgentInnovationSkillsEnabled] = useState(true);
  const [isAgentOriginalitySkillsEnabled, setIsAgentOriginalitySkillsEnabled] = useState(true);
  const [isAgentVisionSkillsEnabled, setIsAgentVisionSkillsEnabled] = useState(true);
  const [isAgentStrategySkillsEnabled, setIsAgentStrategySkillsEnabled] = useState(true);
  const [isAgentPlanningSkillsEnabled, setIsAgentPlanningSkillsEnabled] = useState(true);
  const [isAgentOrganizationSkillsEnabled, setIsAgentOrganizationSkillsEnabled] = useState(true);
  const [isAgentExecutionSkillsEnabled, setIsAgentExecutionSkillsEnabled] = useState(true);
  const [isAgentMonitoringSkillsEnabled, setIsAgentMonitoringSkillsEnabled] = useState(true);
  const [isAgentEvaluationSkillsEnabled, setIsAgentEvaluationSkillsEnabled] = useState(true);
  const [isAgentAdaptationSkillsEnabled, setIsAgentAdaptationSkillsEnabled] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const fetchedAgents = await agentService.getAgents(supabase);
        setAgents(fetchedAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Error fetching agents",
          description: "Failed to load the list of AI Agents.",
          variant: "destructive",
        });
      }
    };

    fetchAgents();
  }, [supabase]);

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setIsEditing(false);
    setNewAgentName(agent.name);
    setNewAgentDescription(agent.description);
    setNewAgentModel(agent.model);
    setNewAgentTemperature(agent.temperature);
    setNewAgentMaxTokens(agent.max_tokens);
    setNewAgentPrompt(agent.prompt);
    setIsAgentActive(agent.is_active);
    setIsAgentPublic(agent.is_public);
    setIsAgentSafeMode(agent.is_safe_mode);
    setIsAgentStreaming(agent.is_streaming);
    setIsAgentContextAware(agent.is_context_aware);
    setIsAgentKnowledgeEnabled(agent.is_knowledge_enabled);
    setIsAgentToolsEnabled(agent.is_tools_enabled);
    setIsAgentReasoningEnabled(agent.is_reasoning_enabled);
    setIsAgentMemoryEnabled(agent.is_memory_enabled);
    setIsAgentGoalsEnabled(agent.is_goals_enabled);
    setIsAgentConstraintsEnabled(agent.is_constraints_enabled);
    setIsAgentSelfImprovementEnabled(agent.is_self_improvement_enabled);
    setIsAgentLongTermPlanningEnabled(agent.is_long_term_planning_enabled);
    setIsAgentMultiAgentCollaborationEnabled(agent.is_multi_agent_collaboration_enabled);
    setIsAgentEmotionalIntelligenceEnabled(agent.is_emotional_intelligence_enabled);
    setIsAgentEthicalFrameworkEnabled(agent.is_ethical_framework_enabled);
    setIsAgentCreativityEnhancementEnabled(agent.is_creativity_enhancement_enabled);
    setIsAgentCriticalThinkingEnhancementEnabled(agent.is_critical_thinking_enhancement_enabled);
    setIsAgentLearningFromFeedbackEnabled(agent.is_learning_from_feedback_enabled);
    setIsAgentComplexProblemSolvingEnabled(agent.is_complex_problem_solving_enabled);
    setIsAgentDecisionMakingEnabled(agent.is_decision_making_enabled);
    setIsAgentRiskAssessmentEnabled(agent.is_risk_assessment_enabled);
    setIsAgentResourceManagementEnabled(agent.is_resource_management_enabled);
    setIsAgentTimeManagementEnabled(agent.is_time_management_enabled);
    setIsAgentCommunicationSkillsEnabled(agent.is_communication_skills_enabled);
    setIsAgentNegotiationSkillsEnabled(agent.is_negotiation_skills_enabled);
    setIsAgentLeadershipSkillsEnabled(agent.is_leadership_skills_enabled);
    setIsAgentTeamworkSkillsEnabled(agent.is_teamwork_skills_enabled);
    setIsAgentAdaptabilitySkillsEnabled(agent.is_adaptability_skills_enabled);
    setIsAgentStressManagementSkillsEnabled(agent.is_stress_management_skills_enabled);
    setIsAgentConflictResolutionSkillsEnabled(agent.is_conflict_resolution_skills_enabled);
    setIsAgentCulturalSensitivitySkillsEnabled(agent.is_cultural_sensitivity_skills_enabled);
    setIsAgentEmotionalRegulationSkillsEnabled(agent.is_emotional_regulation_skills_enabled);
    setIsAgentEmpathySkillsEnabled(agent.is_empathy_skills_enabled);
    setIsAgentSocialAwarenessSkillsEnabled(agent.is_social_awareness_skills_enabled);
    setIsAgentSelfAwarenessSkillsEnabled(agent.is_self_awareness_skills_enabled);
    setIsAgentSelfRegulationSkillsEnabled(agent.is_self_regulation_skills_enabled);
    setIsAgentMotivationSkillsEnabled(agent.is_motivation_skills_enabled);
    setIsAgentResilienceSkillsEnabled(agent.is_resilience_skills_enabled);
    setIsAgentOptimismSkillsEnabled(agent.is_optimism_skills_enabled);
    setIsAgentCuriositySkillsEnabled(agent.is_curiosity_skills_enabled);
    setIsAgentOpenMindednessSkillsEnabled(agent.is_open_mindedness_skills_enabled);
    setIsAgentHumilitySkillsEnabled(agent.is_humility_skills_enabled);
    setIsAgentGratitudeSkillsEnabled(agent.is_gratitude_skills_enabled);
    setIsAgentForgivenessSkillsEnabled(agent.is_forgiveness_skills_enabled);
    setIsAgentCompassionSkillsEnabled(agent.is_compassion_skills_enabled);
    setIsAgentKindnessSkillsEnabled(agent.is_kindness_skills_enabled);
    setIsAgentGenerositySkillsEnabled(agent.is_generosity_skills_enabled);
    setIsAgentServiceSkillsEnabled(agent.is_service_skills_enabled);
    setIsAgentJusticeSkillsEnabled(agent.is_justice_skills_enabled);
    setIsAgentCourageSkillsEnabled(agent.is_courage_skills_enabled);
    setIsAgentPerseveranceSkillsEnabled(agent.is_perseverance_skills_enabled);
    setIsAgentPatienceSkillsEnabled(agent.is_patience_skills_enabled);
    setIsAgentHonestySkillsEnabled(agent.is_honesty_skills_enabled);
    setIsAgentIntegritySkillsEnabled(agent.is_integrity_skills_enabled);
    setIsAgentResponsibilitySkillsEnabled(agent.is_responsibility_skills_enabled);
    setIsAgentAccountabilitySkillsEnabled(agent.is_accountability_skills_enabled);
    setIsAgentLoyaltySkillsEnabled(agent.is_loyalty_skills_enabled);
    setIsAgentRespectSkillsEnabled(agent.is_respect_skills_enabled);
    setIsAgentToleranceSkillsEnabled(agent.is_tolerance_skills_enabled);
    setIsAgentAcceptanceSkillsEnabled(agent.is_acceptance_skills_enabled);
    setIsAgentInclusivitySkillsEnabled(agent.is_inclusivity_skills_enabled);
    setIsAgentDiversitySkillsEnabled(agent.is_diversity_skills_enabled);
    setIsAgentEquitySkillsEnabled(agent.is_equity_skills_enabled);
    setIsAgentBelongingSkillsEnabled(agent.is_belonging_skills_enabled);
    setIsAgentWellbeingSkillsEnabled(agent.is_wellbeing_skills_enabled);
    setIsAgentHappinessSkillsEnabled(agent.is_happiness_skills_enabled);
    setIsAgentFulfillmentSkillsEnabled(agent.is_fulfillment_skills_enabled);
    setIsAgentMeaningSkillsEnabled(agent.is_meaning_skills_enabled);
    setIsAgentPurposeSkillsEnabled(agent.is_purpose_skills_enabled);
    setIsAgentLegacySkillsEnabled(agent.is_legacy_skills_enabled);
    setIsAgentImpactSkillsEnabled(agent.is_impact_skills_enabled);
    setIsAgentTransformationSkillsEnabled(agent.is_transformation_skills_enabled);
    setIsAgentGrowthSkillsEnabled(agent.is_growth_skills_enabled);
    setIsAgentLearningSkillsEnabled(agent.is_learning_skills_enabled);
    setIsAgentDevelopmentSkillsEnabled(agent.is_development_skills_enabled);
    setIsAgentImprovementSkillsEnabled(agent.is_improvement_skills_enabled);
    setIsAgentProgressSkillsEnabled(agent.is_progress_skills_enabled);
    setIsAgentSuccessSkillsEnabled(agent.is_success_skills_enabled);
    setIsAgentAchievementSkillsEnabled(agent.is_achievement_skills_enabled);
    setIsAgentRecognitionSkillsEnabled(agent.is_recognition_skills_enabled);
    setIsAgentAppreciationSkillsEnabled(agent.is_appreciation_skills_enabled);
    setIsAgentCelebrationSkillsEnabled(agent.is_celebration_skills_enabled);
    setIsAgentJoySkillsEnabled(agent.is_joy_skills_enabled);
    setIsAgentPeaceSkillsEnabled(agent.is_peace_skills_enabled);
    setIsAgentLoveSkillsEnabled(agent.is_love_skills_enabled);
    setIsAgentHopeSkillsEnabled(agent.is_hope_skills_enabled);
    setIsAgentFaithSkillsEnabled(agent.is_faith_skills_enabled);
    setIsAgentCharitySkillsEnabled(agent.is_charity_skills_enabled);
    setIsAgentVirtueSkillsEnabled(agent.is_virtue_skills_enabled);
    setIsAgentGoodnessSkillsEnabled(agent.is_goodness_skills_enabled);
    setIsAgentTruthSkillsEnabled(agent.is_truth_skills_enabled);
    setIsAgentBeautySkillsEnabled(agent.is_beauty_skills_enabled);
    setIsAgentWisdomSkillsEnabled(agent.is_wisdom_skills_enabled);
    setIsAgentKnowledgeSkillsEnabled(agent.is_knowledge_skills_enabled);
    setIsAgentUnderstandingSkillsEnabled(agent.is_understanding_skills_enabled);
    setIsAgentInsightSkillsEnabled(agent.is_insight_skills_enabled);
    setIsAgentIntuitionSkillsEnabled(agent.is_intuition_skills_enabled);
    setIsAgentImaginationSkillsEnabled(agent.is_imagination_skills_enabled);
    setIsAgentCreativitySkillsEnabled(agent.is_creativity_skills_enabled);
    setIsAgentInnovationSkillsEnabled(agent.is_innovation_skills_enabled);
    setIsAgentOriginalitySkillsEnabled(agent.is_originality_skills_enabled);
    setIsAgentVisionSkillsEnabled(agent.is_vision_skills_enabled);
    setIsAgentStrategySkillsEnabled(agent.is_strategy_skills_enabled);
    setIsAgentPlanningSkillsEnabled(agent.is_planning_skills_enabled);
    setIsAgentOrganizationSkillsEnabled(agent.is_organization_skills_enabled);
    setIsAgentExecutionSkillsEnabled(agent.is_execution_skills_enabled);
    setIsAgentMonitoringSkillsEnabled(agent.is_monitoring_skills_enabled);
    setIsAgentEvaluationSkillsEnabled(agent.is_evaluation_skills_enabled);
    setIsAgentAdaptationSkillsEnabled(agent.is_adaptation_skills_enabled);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (selectedAgent) {
      setNewAgentName(selectedAgent.name);
      setNewAgentDescription(selectedAgent.description);
      setNewAgentModel(selectedAgent.model);
      setNewAgentTemperature(selectedAgent.temperature);
      setNewAgentMaxTokens(selectedAgent.max_tokens);
      setNewAgentPrompt(selectedAgent.prompt);
      setIsAgentActive(selectedAgent.is_active);
      setIsAgentPublic(selectedAgent.is_public);
      setIsAgentSafeMode(selectedAgent.is_safe_mode);
      setIsAgentStreaming(selectedAgent.is_streaming);
      setIsAgentContextAware(selectedAgent.is_context_aware);
      setIsAgentKnowledgeEnabled(selectedAgent.is_knowledge_enabled);
      setIsAgentToolsEnabled(selectedAgent.is_tools_enabled);
      setIsAgentReasoningEnabled(selectedAgent.is_reasoning_enabled);
      setIsAgentMemoryEnabled(selectedAgent.is_memory_enabled);
      setIsAgentGoalsEnabled(selectedAgent.is_goals_enabled);
      setIsAgentConstraintsEnabled(selectedAgent.is_constraints_enabled);
      setIsAgentSelfImprovementEnabled(selectedAgent.is_self_improvement_enabled);
      setIsAgentLongTermPlanningEnabled(selectedAgent.is_long_term_planning_enabled);
      setIsAgentMultiAgentCollaborationEnabled(selectedAgent.is_multi_agent_collaboration_enabled);
      setIsAgentEmotionalIntelligenceEnabled(selectedAgent.is_emotional_intelligence_enabled);
      setIsAgentEthicalFrameworkEnabled(selectedAgent.is_ethical_framework_enabled);
      setIsAgentCreativityEnhancementEnabled(selectedAgent.is_creativity_enhancement_enabled);
      setIsAgentCriticalThinkingEnhancementEnabled(selectedAgent.is_critical_thinking_enhancement_enabled);
      setIsAgentLearningFromFeedbackEnabled(selectedAgent.is_learning_from_feedback_enabled);
      setIsAgentComplexProblemSolvingEnabled(selectedAgent.is_complex_problem_solving_enabled);
      setIsAgentDecisionMakingEnabled(selectedAgent.is_decision_making_enabled);
      setIsAgentRiskAssessmentEnabled(selectedAgent.is_risk_assessment_enabled);
      setIsAgentResourceManagementEnabled(selectedAgent.is_resource_management_enabled);
      setIsAgentTimeManagementEnabled(selectedAgent.is_time_management_enabled);
      setIsAgentCommunicationSkillsEnabled(selectedAgent.is_communication_skills_enabled);
      setIsAgentNegotiationSkillsEnabled(selectedAgent.is_negotiation_skills_enabled);
      setIsAgentLeadershipSkillsEnabled(selectedAgent.is_leadership_skills_enabled);
      setIsAgentTeamworkSkillsEnabled(selectedAgent.is_teamwork_skills_enabled);
      setIsAgentAdaptabilitySkillsEnabled(selectedAgent.is_adaptability_skills_enabled);
      setIsAgentStressManagementSkillsEnabled(selectedAgent.is_stress_management_skills_enabled);
      setIsAgentConflictResolutionSkillsEnabled(selectedAgent.is_conflict_resolution_skills_enabled);
      setIsAgentCulturalSensitivitySkillsEnabled(selectedAgent.is_cultural_sensitivity_skills_enabled);
      setIsAgentEmotionalRegulationSkillsEnabled(selectedAgent.is_emotional_regulation_skills_enabled);
      setIsAgentEmpathySkillsEnabled(selectedAgent.is_empathy_skills_enabled);
      setIsAgentSocialAwarenessSkillsEnabled(selectedAgent.is_social_awareness_skills_enabled);
      setIsAgentSelfAwarenessSkillsEnabled(selectedAgent.is_self_awareness_skills_enabled);
      setIsAgentSelfRegulationSkillsEnabled(selectedAgent.is_self_regulation_skills_enabled);
      setIsAgentMotivationSkillsEnabled(selectedAgent.is_motivation_skills_enabled);
      setIsAgentResilienceSkillsEnabled(selectedAgent.is_resilience_skills_enabled);
      setIsAgentOptimismSkillsEnabled(selectedAgent.is_optimism_skills_enabled);
      setIsAgentCuriositySkillsEnabled(selectedAgent.is_curiosity_skills_enabled);
      setIsAgentOpenMindednessSkillsEnabled(selectedAgent.is_open_mindedness_skills_enabled);
      setIsAgentHumilitySkillsEnabled(selectedAgent.is_humility_skills_enabled);
      setIsAgentGratitudeSkillsEnabled(selectedAgent.is_gratitude_skills_enabled);
      setIsAgentForgivenessSkillsEnabled(selectedAgent.is_forgiveness_skills_enabled);
      setIsAgentCompassionSkillsEnabled(selectedAgent.is_compassion_skills_enabled);
      setIsAgentKindnessSkillsEnabled(selectedAgent.is_kindness_skills_enabled);
      setIsAgentGenerositySkillsEnabled(selectedAgent.is_generosity_skills_enabled);
      setIsAgentServiceSkillsEnabled(selectedAgent.is_service_skills_enabled);
      setIsAgentJusticeSkillsEnabled(selectedAgent.is_justice_skills_enabled);
      setIsAgentCourageSkillsEnabled(selectedAgent.is_courage_skills_enabled);
      setIsAgentPerseveranceSkillsEnabled(selectedAgent.is_perseverance_skills_enabled);
      setIsAgentPatienceSkillsEnabled(selectedAgent.is_patience_skills_enabled);
      setIsAgentHonestySkillsEnabled(selectedAgent.is_honesty_skills_enabled);
      setIsAgentIntegritySkillsEnabled(selectedAgent.is_integrity_skills_enabled);
      setIsAgentResponsibilitySkillsEnabled(selectedAgent.is_responsibility_skills_enabled);
      setIsAgentAccountabilitySkillsEnabled(selectedAgent.is_accountability_skills_enabled);
      setIsAgentLoyaltySkillsEnabled(selectedAgent.is_loyalty_skills_enabled);
      setIsAgentRespectSkillsEnabled(selectedAgent.is_respect_skills_enabled);
      setIsAgentToleranceSkillsEnabled(selectedAgent.is_tolerance_skills_enabled);
      setIsAgentAcceptanceSkillsEnabled(selectedAgent.is_acceptance_skills_enabled);
      setIsAgentInclusivitySkillsEnabled(selectedAgent.is_inclusivity_skills_enabled);
      setIsAgentDiversitySkillsEnabled(selectedAgent.is_diversity_skills_enabled);
      setIsAgentEquitySkillsEnabled(selectedAgent.is_equ
