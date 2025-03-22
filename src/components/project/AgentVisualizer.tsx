import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Brain,
  CircleCheck,
  CircleAlert,
  FileText,
  MessageSquare,
  Search,
  Network,
  ArrowRightLeft,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Agent, agentService } from "@/services/agentService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

type AgentVisualizerProps = {
  projectId: string;
  onAgentSelect?: (agent: Agent) => void;
};

const AgentVisualizer = ({ projectId, onAgentSelect }: AgentVisualizerProps) => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agentInteractions, setAgentInteractions] = useState<Record<string, string[]>>({});
  const [isCollaborating, setIsCollaborating] = useState(false);
  
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const userAgents = await agentService.getUserAgents(user.id);
          
          if (userAgents.length > 0) {
            setAgents(userAgents);
            setActiveAgent(userAgents[0].id);
          } else {
            setAgents(getMockAgents());
            setActiveAgent(getMockAgents()[0].id);
          }
        } else {
          setAgents(getMockAgents());
          setActiveAgent(getMockAgents()[0].id);
        }
      } catch (error) {
        console.error("Error loading agents:", error);
        setAgents(getMockAgents());
        setActiveAgent(getMockAgents()[0].id);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAgents();
  }, [projectId, supabase.auth]);
  
  useEffect(() => {
    if (!activeAgent) return;
    
    const subscription = agentService.subscribeToAgentUpdates(
      activeAgent,
      (updatedAgent) => {
        setAgents((currentAgents) =>
          currentAgents.map((agent) =>
            agent.id === updatedAgent.id ? { ...agent, ...updatedAgent } : agent
          )
        );
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [activeAgent]);

  useEffect(() => {
    const subscriptions = agents.map(agent => {
      return agentService.subscribeToAgentInteractions(
        agent.id,
        (interaction) => {
          if (interaction.type === 'output' || interaction.type === 'insight') {
            setAgentInteractions(prev => ({
              ...prev,
              [agent.id]: [...(prev[agent.id] || []), interaction.content]
            }));
          }
        }
      );
    });
    
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [agents]);

  const currentAgent = agents.find(agent => agent.id === activeAgent);

  const handleAgentClick = (agent: Agent) => {
    setActiveAgent(agent.id);
    
    if (onAgentSelect) {
      onAgentSelect(agent);
      
      document.querySelector('[data-value="explain"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }
  };

  const startCollaboration = async () => {
    if (agents.length < 2) {
      toast({
        title: "Collaboration error",
        description: "Need at least two active agents to start a collaboration",
        variant: "destructive"
      });
      return;
    }
    
    setIsCollaborating(true);
    
    try {
      const activeAgentIds = agents.filter(a => a.status !== 'error').map(a => a.id);
      await agentService.startCollaboration(
        projectId,
        activeAgentIds,
        0.7
      );
      
      toast({
        title: "Collaboration started",
        description: "Agents are now collaborating in real-time"
      });
    } catch (error) {
      console.error("Collaboration error:", error);
      toast({
        title: "Collaboration error",
        description: "Failed to start agent collaboration",
        variant: "destructive"
      });
      setIsCollaborating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : agents.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Active Research Agents
            </h3>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentAgent && onAgentSelect) {
                    onAgentSelect(currentAgent);
                    
                    document.querySelector('[data-value="explain"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }
                }}
                disabled={!currentAgent}
                className="flex items-center text-xs"
              >
                <Info className="mr-1.5 h-3.5 w-3.5" />
                View Explainability
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={startCollaboration}
                disabled={isCollaborating || agents.length < 2}
                className="flex items-center text-xs"
              >
                <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                {isCollaborating ? "Collaboration in progress..." : "Start Agent Collaboration"}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {agents.slice(0, 4).map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isActive={agent.id === activeAgent}
                onClick={() => handleAgentClick(agent)}
                lastMessage={agentInteractions[agent.id]?.slice(-1)[0]}
              />
            ))}
          </div>
          
          {currentAgent && (
            <motion.div
              key={currentAgent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-card/30 rounded-lg p-4 border border-border/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium">{currentAgent.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <span>Type: {currentAgent.type}</span>
                    {currentAgent.confidence && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Confidence: {(currentAgent.confidence * 100).toFixed(0)}%</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={
                    currentAgent.status === "complete" ? "default" :
                    currentAgent.status === "analyzing" ? "secondary" :
                    currentAgent.status === "error" ? "destructive" : "outline"
                  }
                  className="capitalize"
                >
                  {currentAgent.status}
                </Badge>
              </div>
              
              {currentAgent.status === "analyzing" && (
                <div className="flex items-center justify-center bg-secondary/50 rounded-lg p-6 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-3 text-sm">Agent is analyzing data...</p>
                  </div>
                </div>
              )}
              
              {currentAgent.status === "idle" && (
                <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg p-6 mb-4">
                  <Network className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">Ready for analysis</p>
                </div>
              )}
              
              {currentAgent.status === "complete" && currentAgent.insights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    <h4 className="font-medium">Key Insights</h4>
                  </div>
                  
                  <ul className="space-y-2 max-h-36 overflow-y-auto">
                    {currentAgent.insights.map((insight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start p-2 bg-secondary/40 rounded-lg text-sm"
                      >
                        <CircleCheck className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-2" />
                        <span>{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentAgent.status === "error" && (
                <div className="flex flex-col items-center justify-center bg-destructive/10 rounded-lg p-6 mb-4">
                  <CircleAlert className="h-10 w-10 text-destructive mb-3" />
                  <p className="text-destructive font-medium text-sm">Analysis error</p>
                </div>
              )}
              
              {agentInteractions[currentAgent.id]?.length > 0 && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    <h4 className="font-medium">Agent Thinking</h4>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {agentInteractions[currentAgent.id].map((message, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * idx, duration: 0.3 }}
                        className="mb-2 text-sm"
                      >
                        <p className="text-muted-foreground">{message}</p>
                        {idx < agentInteractions[currentAgent.id].length - 1 && (
                          <div className="border-b border-border/30 my-2" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No agents configured</p>
        </div>
      )}
    </div>
  );
};

type AgentCardProps = {
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
  lastMessage?: string;
};

const AgentCard = ({ agent, isActive, onClick, lastMessage }: AgentCardProps) => {
  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "complete":
        return <CircleCheck className="h-4 w-4 text-primary" />;
      case "analyzing":
        return <div className="h-4 w-4 rounded-full border-2 border-secondary border-t-primary animate-spin"></div>;
      case "error":
        return <CircleAlert className="h-4 w-4 text-destructive" />;
      default:
        return <Brain className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm flex flex-col h-full ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-secondary/50 hover:bg-secondary"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium truncate">{agent.name}</div>
        <div>{getStatusIcon(agent.status)}</div>
      </div>
      <div className={`text-xs mt-1 truncate ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {agent.type}
      </div>
      
      {lastMessage && (
        <div className={`text-xs mt-2 line-clamp-2 italic ${
          isActive ? "text-primary-foreground/70" : "text-muted-foreground/70"
        }`}>
          "{lastMessage}"
        </div>
      )}
    </motion.div>
  );
};

function getMockAgents(): Agent[] {
  return [
    {
      id: "grounded-theory",
      name: "Grounded Theory Agent",
      type: "methodology",
      methodology: "Grounded Theory",
      confidence: 0.89,
      status: "complete",
      insights: [
        "Common themes include privacy concerns across demographic groups.",
        "Emergent pattern of trust issues with automated systems.",
        "Theoretical saturation reached in core trust-building category."
      ]
    },
    {
      id: "feminist-theory",
      name: "Feminist Theory Agent",
      type: "theoretical",
      framework: "Feminist Theory",
      confidence: 0.78,
      status: "complete",
      insights: [
        "Gender differences in technology adoption and usage patterns.",
        "Power dynamics evident in user interface design choices.",
        "Patterns of exclusion in AI training data."
      ]
    },
    {
      id: "bias-identification",
      name: "Bias Identification Agent",
      type: "validation",
      confidence: 0.82,
      status: "analyzing",
      insights: []
    },
    {
      id: "triangulation",
      name: "Triangulation Agent",
      type: "validation",
      confidence: 0.65,
      status: "idle",
      insights: []
    },
  ];
}

export default AgentVisualizer;
