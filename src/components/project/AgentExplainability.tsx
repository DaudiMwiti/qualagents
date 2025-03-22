
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Logs, 
  GitBranch, 
  Signal, 
  Network,
  Brain,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { Agent } from "@/services/agentService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AgentExplainabilityProps {
  agent: Agent;
  agentInteractions?: {
    content: string;
    timestamp: string;
    type: 'input' | 'output' | 'insight' | 'decision';
  }[];
}

type DecisionNode = {
  id: string;
  label: string;
  confidence: number;
  children?: DecisionNode[];
  explanation?: string;
};

// Mock data - would come from the agent's actual decision process in production
const mockDecisionTree: DecisionNode = {
  id: "root",
  label: "Initial Analysis",
  confidence: 0.9,
  explanation: "Starting analysis of the qualitative data corpus using the agent's methodology.",
  children: [
    {
      id: "node-1",
      label: "Identify Key Themes",
      confidence: 0.85,
      explanation: "Extracting recurring patterns and topics from participant narratives.",
      children: [
        {
          id: "node-1-1",
          label: "Privacy Concerns",
          confidence: 0.92,
          explanation: "Multiple participants expressed concerns about data privacy in telehealth."
        },
        {
          id: "node-1-2",
          label: "Accessibility Issues",
          confidence: 0.78,
          explanation: "Some participants mentioned difficulty accessing or using telehealth platforms."
        }
      ]
    },
    {
      id: "node-2",
      label: "Apply Theoretical Framework",
      confidence: 0.82,
      explanation: "Interpreting identified themes through the agent's theoretical perspective.",
      children: [
        {
          id: "node-2-1",
          label: "Power Dynamics",
          confidence: 0.75,
          explanation: "Analysis of provider-patient power relationships in digital contexts."
        }
      ]
    },
    {
      id: "node-3",
      label: "Validate Findings",
      confidence: 0.88,
      explanation: "Cross-checking interpretations against original data sources.",
      children: [
        {
          id: "node-3-1",
          label: "Member Checking",
          confidence: 0.71,
          explanation: "Verification of interpretations with sample participants."
        }
      ]
    }
  ]
};

// Mock reasoning logs data
const mockReasoningLogs = [
  {
    step: 1,
    content: "Initializing analysis with Grounded Theory approach",
    confidence: 0.95,
    timestamp: "2023-06-02T10:23:15Z"
  },
  {
    step: 2,
    content: "Coding phase: identified 12 initial codes from interview transcripts",
    confidence: 0.89,
    timestamp: "2023-06-02T10:24:30Z"
  },
  {
    step: 3,
    content: "Grouping related codes into categories; found 3 major categories",
    confidence: 0.84,
    timestamp: "2023-06-02T10:25:45Z"
  },
  {
    step: 4,
    content: "Theoretical saturation check: sufficient data for 'privacy concerns' category",
    confidence: 0.91,
    timestamp: "2023-06-02T10:27:10Z"
  },
  {
    step: 5,
    content: "Developing core category: 'Trust dynamics in virtual care environments'",
    confidence: 0.87,
    timestamp: "2023-06-02T10:29:22Z"
  }
];

// Mock insight source data
const mockInsightSources = [
  { source: "Interview #4", relevance: 0.92, excerpt: "I worry about where my health data goes after these virtual visits..." },
  { source: "Interview #7", relevance: 0.85, excerpt: "The doctor seemed distracted during our video call, not like in-person visits." },
  { source: "Focus Group B", relevance: 0.78, excerpt: "Several participants nodded when privacy concerns were mentioned." },
  { source: "Survey responses", relevance: 0.90, excerpt: "73% expressed some level of concern about data privacy." },
  { source: "Literature review", relevance: 0.65, excerpt: "Smith et al. (2021) found similar patterns in their telehealth study." }
];

const AgentExplainability = ({ agent, agentInteractions = [] }: AgentExplainabilityProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]));
  
  // Toggle expansion of a node in the decision tree
  const toggleNode = (nodeId: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (expandedNodes.has(nodeId)) {
      newExpandedNodes.delete(nodeId);
    } else {
      newExpandedNodes.add(nodeId);
    }
    setExpandedNodes(newExpandedNodes);
  };
  
  // Helper function to render a decision tree node recursively
  const renderDecisionNode = (node: DecisionNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="relative">
        <div 
          className={`flex items-start p-3 mb-2 rounded-md transition-colors ${depth === 0 ? 'bg-secondary/50' : 'bg-background'}`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {hasChildren && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 mr-2 mt-0.5"
              onClick={() => toggleNode(node.id)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium text-sm">{node.label}</span>
              <Badge 
                variant={node.confidence > 0.8 ? "default" : node.confidence > 0.6 ? "secondary" : "outline"}
                className="ml-2 h-5 text-xs"
              >
                {Math.round(node.confidence * 100)}% confidence
              </Badge>
            </div>
            
            {node.explanation && (
              <p className="text-xs text-muted-foreground mt-1">{node.explanation}</p>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mb-2">
            {node.children!.map(childNode => renderDecisionNode(childNode, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  // Use real data if available, otherwise fall back to mock data
  const reasoningLogs = agentInteractions.length > 0 
    ? agentInteractions.map((interaction, idx) => ({
        step: idx + 1,
        content: interaction.content,
        timestamp: interaction.timestamp,
        confidence: agent.confidence || 0.8
      }))
    : mockReasoningLogs;
  
  const confidenceData = reasoningLogs.map(log => ({
    step: `Step ${log.step}`,
    confidence: log.confidence * 100
  }));

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Agent Explainability
            </CardTitle>
            <CardDescription>
              Understand how {agent.name} reached its conclusions
            </CardDescription>
          </div>
          <Badge 
            variant={
              agent.confidence > 0.8 ? "default" :
              agent.confidence > 0.6 ? "secondary" : "outline"
            }
            className="capitalize"
          >
            {Math.round((agent.confidence || 0) * 100)}% Overall Confidence
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="reasoning">
          <TabsList className="mb-4 bg-secondary/50 w-full">
            <TabsTrigger value="reasoning" className="flex">
              <Logs className="h-4 w-4 mr-2" />
              Reasoning Logs
            </TabsTrigger>
            <TabsTrigger value="decision-tree" className="flex">
              <GitBranch className="h-4 w-4 mr-2" />
              Decision Tree
            </TabsTrigger>
            <TabsTrigger value="confidence" className="flex">
              <Signal className="h-4 w-4 mr-2" />
              Confidence Analysis
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex">
              <ExternalLink className="h-4 w-4 mr-2" />
              Insight Sources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reasoning" className="m-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  Step-by-step reasoning process
                </h4>
              </div>
              
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                {reasoningLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-secondary/30 p-3 rounded-md"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">Step {log.step}</span>
                      <Badge variant="outline" className="text-xs h-5">
                        {Math.round(log.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.content}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="decision-tree" className="m-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center">
                  <Network className="h-4 w-4 mr-2 text-primary" />
                  Analysis decision tree
                </h4>
                <span className="text-xs text-muted-foreground">
                  Click nodes to explore the decision path
                </span>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto pr-2">
                {renderDecisionNode(mockDecisionTree)}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="confidence" className="m-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                  Confidence over analysis steps
                </h4>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={confidenceData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <XAxis dataKey="step" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Confidence']}
                      labelFormatter={(label) => `Analysis ${label}`}
                    />
                    <Bar dataKey="confidence" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                      {confidenceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.confidence > 80 ? 'var(--primary)' : 
                                entry.confidence > 60 ? 'var(--primary-light)' : 
                                'var(--muted)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="m-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                  Insight source material
                </h4>
              </div>
              
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                <Accordion type="single" collapsible className="w-full">
                  {mockInsightSources.map((source, idx) => (
                    <AccordionItem key={idx} value={`source-${idx}`}>
                      <AccordionTrigger className="py-3 px-4 bg-secondary/30 rounded-md hover:bg-secondary/50 hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-medium text-sm">{source.source}</span>
                          <Badge variant="outline" className="text-xs h-5">
                            {Math.round(source.relevance * 100)}% relevance
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-3 text-sm text-muted-foreground border-b border-border/50">
                        "{source.excerpt}"
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgentExplainability;
