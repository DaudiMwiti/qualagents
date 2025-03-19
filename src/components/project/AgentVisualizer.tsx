
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Brain,
  CircleCheck,
  CircleAlert,
  FileText,
  MessageSquare,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Agent = {
  id: string;
  name: string;
  methodology: string;
  confidence: number;
  status: "idle" | "analyzing" | "complete" | "error";
  insights: string[];
};

type AgentVisualizerProps = {
  projectId: string;
};

const AgentVisualizer = ({ projectId }: AgentVisualizerProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  
  // Simulate fetching agents
  useEffect(() => {
    // This would be a real API call in production
    const mockAgents: Agent[] = [
      {
        id: "agent-1",
        name: "Grounded Theory Agent",
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
        id: "agent-2",
        name: "Phenomenology Agent",
        methodology: "Phenomenology",
        confidence: 0.78,
        status: "complete",
        insights: [
          "Users express feelings of disempowerment when encountering AI systems.",
          "Shared experience of wonder and confusion when first interacting with the platform.",
          "Distinct lived experience variations based on technical background."
        ]
      },
      {
        id: "agent-3",
        name: "Discourse Analysis Agent",
        methodology: "Discourse Analysis",
        confidence: 0.82,
        status: "analyzing",
        insights: [
          "Power dynamics evident in language patterns when describing AI capabilities.",
          "Recurring metaphors of 'magic' and 'black box' in participant descriptions."
        ]
      },
      {
        id: "agent-4",
        name: "Narrative Analysis Agent",
        methodology: "Narrative Analysis",
        confidence: 0.65,
        status: "idle",
        insights: []
      },
    ];
    
    setAgents(mockAgents);
    setActiveAgent(mockAgents[0].id);
  }, [projectId]);

  // Get the currently active agent
  const currentAgent = agents.find(agent => agent.id === activeAgent);

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Research Agents
        </h3>
        
        <div className="space-y-2">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isActive={agent.id === activeAgent}
              onClick={() => setActiveAgent(agent.id)}
            />
          ))}
        </div>
        
        <Button className="w-full mt-4">
          <Search className="mr-2 h-4 w-4" />
          Add New Agent
        </Button>
      </div>
      
      <div className="lg:col-span-2">
        {currentAgent ? (
          <motion.div
            key={currentAgent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card h-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-medium">{currentAgent.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <span>Methodology: {currentAgent.methodology}</span>
                    <span className="mx-2">•</span>
                    <span>Confidence: {(currentAgent.confidence * 100).toFixed(0)}%</span>
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
                <div className="flex items-center justify-center bg-secondary/50 rounded-lg p-8 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                    </div>
                    <p className="mt-4 text-sm">Agent is analyzing your data...</p>
                  </div>
                </div>
              )}
              
              {currentAgent.status === "idle" && (
                <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg p-8 mb-6">
                  <Brain className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">This agent hasn't been activated yet.</p>
                  <Button className="mt-4">
                    Start Analysis
                  </Button>
                </div>
              )}
              
              {currentAgent.status === "complete" && currentAgent.insights.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    <h4 className="font-medium">Key Insights</h4>
                  </div>
                  
                  <ul className="space-y-3">
                    {currentAgent.insights.map((insight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start p-3 bg-secondary/40 rounded-lg"
                      >
                        <CircleCheck className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                        <span>{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ask Follow-up
                    </Button>
                    <Button>
                      Validate Insights
                    </Button>
                  </div>
                </div>
              )}
              
              {currentAgent.status === "error" && (
                <div className="flex flex-col items-center justify-center bg-destructive/10 rounded-lg p-8 mb-6">
                  <CircleAlert className="h-12 w-12 text-destructive mb-3" />
                  <p className="text-destructive font-medium">Analysis encountered an error</p>
                  <Button variant="outline" className="mt-4">
                    Retry Analysis
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select an agent to view insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

type AgentCardProps = {
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
};

const AgentCard = ({ agent, isActive, onClick }: AgentCardProps) => {
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
      className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-secondary/50 hover:bg-secondary"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium">{agent.name}</div>
        <div>{getStatusIcon(agent.status)}</div>
      </div>
      <div className={`text-xs mt-1 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {agent.methodology}
      </div>
    </motion.div>
  );
};

export default AgentVisualizer;
