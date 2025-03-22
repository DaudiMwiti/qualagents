import { useState, useEffect } from "react";
import { Agent } from "@/services/agentService";
import { 
  Brain, 
  FileText, 
  AlertCircle, 
  LineChart, 
  CircleCheck, 
  ArrowRight, 
  MessageSquare,
  Calendar,
  GitBranch 
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import InsightFeedback, { InsightFeedbackData } from "./InsightFeedback";

interface AgentExplainabilityProps {
  agent: Agent;
  onInsightFeedback?: (insightId: string | undefined, agentId: string, insightContent: string) => void;
}

interface ReasoningStep {
  id: string;
  content: string;
  confidence: number;
  timestamp: string;
  sources?: string[];
}

interface DecisionNode {
  id: string;
  description: string;
  alternatives: string[];
  confidence: number;
  children?: DecisionNode[];
}

const AgentExplainability = ({ agent, onInsightFeedback }: AgentExplainabilityProps) => {
  const supabase = useSupabaseClient();
  const [tab, setTab] = useState<'reasoning' | 'decision-tree' | 'confidence' | 'sources'>('reasoning');
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [decisionTree, setDecisionTree] = useState<DecisionNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [feedbackData, setFeedbackData] = useState<Record<string, InsightFeedbackData>>({});
  
  useEffect(() => {
    const fetchAgentExplainability = async () => {
      setLoading(true);
      try {
        const mockReasoningSteps = getMockReasoningSteps(agent);
        const mockDecisionTree = getMockDecisionTree(agent);
        
        setReasoningSteps(mockReasoningSteps);
        setDecisionTree(mockDecisionTree);
        
        if (supabase) {
          try {
            const { data } = await supabase
              .from('agent_insight_feedback')
              .select('*')
              .eq('agentId', agent.id);
              
            if (data) {
              const feedbackMap: Record<string, InsightFeedbackData> = {};
              data.forEach(item => {
                feedbackMap[item.insightId] = item;
              });
              setFeedbackData(feedbackMap);
            }
          } catch (error) {
            console.error("Error fetching feedback:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching agent explainability data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (agent) {
      fetchAgentExplainability();
    }
  }, [agent, supabase]);
  
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };
  
  const handleFeedbackSaved = (feedback: InsightFeedbackData) => {
    setFeedbackData(prev => ({
      ...prev,
      [feedback.insightId || feedback.insight]: feedback
    }));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Loading agent explainability data...</p>
        </div>
      </div>
    );
  }
  
  if (!agent) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Agent Selected</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Please select an agent to view its explainability data.
        </p>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col items-start mb-4">
        <div className="flex items-center mb-2">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{agent.name} Explainability</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Understanding how this agent analyzes data and reaches conclusions
        </p>
      </div>
      
      <div className="flex space-x-1 border-b mb-6">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${
            tab === 'reasoning' 
              ? 'border-primary' 
              : 'border-transparent'
          }`}
          onClick={() => setTab('reasoning')}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Reasoning Logs
        </Button>
        
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${
            tab === 'decision-tree' 
              ? 'border-primary' 
              : 'border-transparent'
          }`}
          onClick={() => setTab('decision-tree')}
        >
          <GitBranch className="mr-2 h-4 w-4" />
          Decision Tree
        </Button>
        
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${
            tab === 'confidence' 
              ? 'border-primary' 
              : 'border-transparent'
          }`}
          onClick={() => setTab('confidence')}
        >
          <LineChart className="mr-2 h-4 w-4" />
          Confidence Analysis
        </Button>
        
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${
            tab === 'sources' 
              ? 'border-primary' 
              : 'border-transparent'
          }`}
          onClick={() => setTab('sources')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Insight Sources
        </Button>
      </div>
      
      {tab === 'reasoning' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reasoning Steps</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Step-by-step reasoning process this agent used to reach its conclusions
          </p>
          
          <div className="space-y-4">
            {reasoningSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6 pb-6"
              >
                {index < reasoningSteps.length - 1 && (
                  <div className="absolute left-2.5 top-6 w-0.5 h-full bg-border" />
                )}
                
                <div className="absolute left-0 top-1.5 rounded-full bg-secondary w-5 h-5 flex items-center justify-center">
                  <span className="text-xs font-medium text-secondary-foreground">
                    {index + 1}
                  </span>
                </div>
                
                <div className="glass-card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Step {index + 1}</span>
                    <Badge variant="outline" className="text-xs">
                      Confidence: {(step.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <p className="text-sm mb-1">{step.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(step.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <InsightFeedback
                    insightId={step.id}
                    agentId={agent.id}
                    insight={step.content}
                    onFeedbackSaved={handleFeedbackSaved}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {tab === 'decision-tree' && decisionTree && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Decision Tree</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Branching decision paths that led to the agent's conclusions
          </p>
          
          <div className="pl-2">
            <DecisionTreeNode 
              node={decisionTree} 
              level={0} 
              isExpanded={expandedNodes.has(decisionTree.id)}
              onToggle={() => toggleNode(decisionTree.id)}
              onFeedbackSaved={handleFeedbackSaved}
              agentId={agent.id}
            />
          </div>
        </div>
      )}
      
      {tab === 'confidence' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confidence Analysis</h3>
          <p className="text-sm text-muted-foreground mb-4">
            How confident the agent is in its analysis and conclusions
          </p>
          
          <div className="glass-card p-4 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Confidence</span>
                <span className="text-sm font-medium">
                  {agent.confidence ? (agent.confidence * 100).toFixed(0) : '75'}%
                </span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full" 
                  style={{ width: `${agent.confidence ? agent.confidence * 100 : 75}%` }}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Confidence by Insight</h4>
              
              {agent.insights.map((insight, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="line-clamp-1">{insight}</span>
                    <span>
                      {75 + Math.floor(Math.random() * 20)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-light h-full rounded-full" 
                      style={{ width: `${75 + Math.floor(Math.random() * 20)}%` }}
                    />
                  </div>
                  
                  <InsightFeedback
                    insightId={`insight-${index}`}
                    agentId={agent.id}
                    insight={insight}
                    onFeedbackSaved={handleFeedbackSaved}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {tab === 'sources' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Insight Sources</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Data sources that informed the agent's analysis and conclusions
          </p>
          
          <div className="space-y-4">
            {agent.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm mb-3">{insight}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">Data Sources:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[1, 2, 3].map((sourceIndex) => (
                          <div 
                            key={sourceIndex} 
                            className="flex items-center text-xs p-2 bg-secondary/50 rounded"
                          >
                            <FileText className="h-3 w-3 mr-1.5 text-primary-light" />
                            <span>
                              Source Document {index + 1}-{sourceIndex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <InsightFeedback
                      insightId={`insight-source-${index}`}
                      agentId={agent.id}
                      insight={insight}
                      onFeedbackSaved={handleFeedbackSaved}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface DecisionTreeNodeProps {
  node: DecisionNode;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onFeedbackSaved: (feedback: InsightFeedbackData) => void;
  agentId: string;
}

const DecisionTreeNode = ({ 
  node, 
  level, 
  isExpanded, 
  onToggle,
  onFeedbackSaved,
  agentId
}: DecisionTreeNodeProps) => {
  return (
    <div className="relative ml-4">
      <div 
        className={`glass-card p-3 mb-2 ${isExpanded ? 'border-primary/30' : ''}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <Button 
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 mr-2"
                onClick={onToggle}
                disabled={!node.children || node.children.length === 0}
              >
                {node.children && node.children.length > 0 && (
                  <ArrowRight 
                    className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                )}
              </Button>
              <span className="text-sm font-medium">{node.description}</span>
            </div>
            
            {node.alternatives.length > 0 && (
              <div className="mt-2 ml-8">
                <p className="text-xs text-muted-foreground mb-1">Alternative considerations:</p>
                <ul className="space-y-1">
                  {node.alternatives.map((alt, i) => (
                    <li key={i} className="text-xs flex items-baseline">
                      <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground mr-2"></span>
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="ml-8 mt-2">
              <InsightFeedback
                insightId={node.id}
                agentId={agentId}
                insight={node.description}
                onFeedbackSaved={onFeedbackSaved}
              />
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs shrink-0">
            {(node.confidence * 100).toFixed(0)}% confident
          </Badge>
        </div>
      </div>
      
      {isExpanded && node.children && node.children.length > 0 && (
        <div className="border-l-2 border-border pl-4 ml-3">
          {node.children.map((child) => (
            <DecisionTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={false}
              onToggle={onToggle}
              onFeedbackSaved={onFeedbackSaved}
              agentId={agentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function getMockReasoningSteps(agent: Agent): ReasoningStep[] {
  const methodology = agent.methodology || agent.framework || agent.type;
  const baseSteps = [
    {
      id: "step-1",
      content: `Initial data exploration through ${methodology} lens. Reviewing raw qualitative data for emerging patterns.`,
      confidence: 0.95,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sources: ["document-1", "document-2"]
    },
    {
      id: "step-2",
      content: `Identified preliminary themes in user narratives related to technology adoption challenges.`,
      confidence: 0.87,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      sources: ["document-1", "document-3"]
    },
    {
      id: "step-3",
      content: `Applied ${methodology} coding approach to organize recurring concepts in the data.`,
      confidence: 0.92,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      sources: ["document-2", "document-4"]
    },
    {
      id: "step-4",
      content: `Analyzed relationships between themes to establish theoretical framework.`,
      confidence: 0.79,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      sources: ["document-1", "document-5"]
    },
    {
      id: "step-5",
      content: `Synthesized findings into coherent insights based on ${methodology} principles.`,
      confidence: 0.88,
      timestamp: new Date().toISOString(),
      sources: ["document-3", "document-4", "document-5"]
    }
  ];

  if (agent.id === "grounded-theory") {
    baseSteps.splice(2, 0, {
      id: "gt-special-1",
      content: "Performed open coding of participant experiences with telehealth interfaces.",
      confidence: 0.91,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.2).toISOString(),
      sources: ["document-2", "document-3"]
    });
  } else if (agent.id === "feminist-theory") {
    baseSteps.splice(1, 0, {
      id: "ft-special-1",
      content: "Examined power dynamics in healthcare technology access across gender groups.",
      confidence: 0.85,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(),
      sources: ["document-1", "document-4"]
    });
  } else if (agent.id === "bias-identification") {
    baseSteps.splice(3, 0, {
      id: "bi-special-1",
      content: "Evaluated potential sampling biases in the collected narratives.",
      confidence: 0.83,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      sources: ["document-2", "document-5"]
    });
  }

  return baseSteps;
}

function getMockDecisionTree(agent: Agent): DecisionNode {
  const methodology = agent.methodology || agent.framework || agent.type;
  
  const decisionTree: DecisionNode = {
    id: "root",
    description: `Apply ${methodology} approach to qualitative data analysis`,
    alternatives: [
      "Use traditional content analysis instead",
      "Apply mixed-methods approach"
    ],
    confidence: 0.92,
    children: [
      {
        id: "node-1",
        description: "Focus on patient narratives about technology barriers",
        alternatives: [
          "Analyze provider perspectives instead",
          "Compare pre-pandemic vs. during-pandemic experiences"
        ],
        confidence: 0.87,
        children: [
          {
            id: "node-1-1",
            description: "Identify recurring themes in access challenges",
            alternatives: [
              "Focus on positive experiences only",
              "Group by demographic characteristics"
            ],
            confidence: 0.91,
            children: []
          },
          {
            id: "node-1-2",
            description: "Analyze emotional responses to technology failures",
            alternatives: [
              "Focus only on technical aspects",
              "Limit to specific platform experiences"
            ],
            confidence: 0.84,
            children: []
          }
        ]
      },
      {
        id: "node-2",
        description: "Explore themes of technological literacy across demographics",
        alternatives: [
          "Focus only on advanced users",
          "Analyze only negative experiences"
        ],
        confidence: 0.88,
        children: [
          {
            id: "node-2-1",
            description: "Compare experiences across age groups",
            alternatives: [
              "Focus only on young adults",
              "Analyze only rural populations"
            ],
            confidence: 0.93,
            children: []
          }
        ]
      }
    ]
  };
  
  if (agent.id === "grounded-theory") {
    decisionTree.children![0].children!.push({
      id: "gt-node-1",
      description: "Develop theoretical framework from emerging patterns",
      alternatives: [
        "Apply pre-existing theoretical model",
        "Focus only on descriptive analysis"
      ],
      confidence: 0.89,
      children: []
    });
  } else if (agent.id === "feminist-theory") {
    decisionTree.children!.push({
      id: "ft-node-1",
      description: "Analyze gender disparities in telehealth access",
      alternatives: [
        "Focus on socioeconomic factors only",
        "Analyze only healthcare provider biases"
      ],
      confidence: 0.86,
      children: [
        {
          id: "ft-node-1-1",
          description: "Identify power dynamics in patient-provider telehealth interactions",
          alternatives: [
            "Focus only on technical platform features",
            "Analyze only scheduling aspects"
          ],
          confidence: 0.81,
          children: []
        }
      ]
    });
  } else if (agent.id === "bias-identification") {
    decisionTree.children!.push({
      id: "bi-node-1",
      description: "Evaluate potential sampling biases in participant selection",
      alternatives: [
        "Focus only on data collection methods",
        "Analyze only researcher bias"
      ],
      confidence: 0.78,
      children: [
        {
          id: "bi-node-1-1",
          description: "Identify underrepresented perspectives in the dataset",
          alternatives: [
            "Focus only on majority demographics",
            "Analyze only complete survey responses"
          ],
          confidence: 0.84,
          children: []
        }
      ]
    });
  }
  
  return decisionTree;
}

export default AgentExplainability;
