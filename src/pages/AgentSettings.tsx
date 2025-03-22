import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import AgentVisualizer from "@/components/project/AgentVisualizer";
import { agentService } from "@/services/agentService";
import { Plus, Edit, Settings, Brain, PenTool } from "lucide-react";

const methodologies = [
  { value: "grounded-theory", label: "Grounded Theory" },
  { value: "phenomenology", label: "Phenomenology" },
  { value: "discourse-analysis", label: "Discourse Analysis" },
  { value: "narrative-analysis", label: "Narrative Analysis" },
];

const theoreticalFrameworks = [
  { value: "feminist-theory", label: "Feminist Theory" },
  { value: "critical-race-theory", label: "Critical Race Theory" },
  { value: "post-colonialism", label: "Post-Colonialism" },
  { value: "structuralism", label: "Structuralism" },
];

const crossCheckingMethods = [
  { value: "bias-identification", label: "Bias Identification" },
  { value: "assumption-validation", label: "Assumption Validation" },
  { value: "triangulation", label: "Triangulation" },
  { value: "member-checking", label: "Member Checking" },
];

const AgentSettings = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [collaborationLevel, setCollaborationLevel] = useState<number>(50);
  const [agentVisibility, setAgentVisibility] = useState<boolean>(true);
  const [selectedMethodology, setSelectedMethodology] = useState<string>("");
  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("demo-project");
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/");
        toast({
          title: "Authentication required",
          description: "Please sign in to access the agent settings.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [navigate, supabase.auth]);
  
  const handleAgentToggle = (agentId: string) => {
    setActiveAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };
  
  const handleSaveSettings = async () => {
    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('agent_settings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          active_agents: activeAgents,
          collaboration_level: collaborationLevel,
          agent_visibility: agentVisibility,
          methodology: selectedMethodology,
          framework: selectedFramework,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your agent configuration has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem updating your agent configuration.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRunSimulation = async () => {
    if (activeAgents.length === 0) {
      toast({
        title: "No agents selected",
        description: "Please select at least one agent to run the simulation.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await agentService.startCollaboration(
        projectId,
        activeAgents,
        collaborationLevel / 100
      );
      
      navigate("/dashboard");
      toast({
        title: "Simulation started",
        description: "Your agent simulation has been initiated. View results in the dashboard.",
      });
    } catch (error) {
      console.error("Error starting simulation:", error);
      toast({
        title: "Error starting simulation",
        description: "There was a problem starting the agent simulation.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <Navbar />
      
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-semibold">AI Agent Configuration</h1>
                <p className="text-muted-foreground mt-1">
                  Customize and manage your qualitative research AI agents
                </p>
              </div>
              <Button
                onClick={() => navigate("/agent-customization")}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <PenTool className="mr-2 h-4 w-4" />
                Design Custom Agent
              </Button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="methodology" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="methodology">Methodology Agents</TabsTrigger>
                  <TabsTrigger value="theoretical">Theoretical Framework</TabsTrigger>
                  <TabsTrigger value="validation">Cross-Checking Agents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="methodology" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {methodologies.map((method) => (
                      <AgentCard
                        key={method.value}
                        id={method.value}
                        title={method.label}
                        description={`Specializes in ${method.label} approach to qualitative data analysis.`}
                        isActive={activeAgents.includes(method.value)}
                        onToggle={() => handleAgentToggle(method.value)}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Primary Methodology</h3>
                    <Select
                      value={selectedMethodology}
                      onValueChange={setSelectedMethodology}
                    >
                      <SelectTrigger className="w-full md:w-72">
                        <SelectValue placeholder="Select primary research methodology" />
                      </SelectTrigger>
                      <SelectContent>
                        {methodologies.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      This methodology will guide the primary analysis approach.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="theoretical" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {theoreticalFrameworks.map((framework) => (
                      <AgentCard
                        key={framework.value}
                        id={framework.value}
                        title={framework.label}
                        description={`Analyzes data through the lens of ${framework.label}.`}
                        isActive={activeAgents.includes(framework.value)}
                        onToggle={() => handleAgentToggle(framework.value)}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Primary Theoretical Framework</h3>
                    <Select
                      value={selectedFramework}
                      onValueChange={setSelectedFramework}
                    >
                      <SelectTrigger className="w-full md:w-72">
                        <SelectValue placeholder="Select primary theoretical framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {theoreticalFrameworks.map((framework) => (
                          <SelectItem key={framework.value} value={framework.value}>
                            {framework.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      This framework will provide the theoretical lens for interpretation.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="validation" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crossCheckingMethods.map((method) => (
                      <AgentCard
                        key={method.value}
                        id={method.value}
                        title={method.label}
                        description={`Ensures research quality through ${method.label}.`}
                        isActive={activeAgents.includes(method.value)}
                        onToggle={() => handleAgentToggle(method.value)}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Collaboration Settings</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="collaboration">Agent Collaboration Level</Label>
                          <span className="text-sm text-muted-foreground">{collaborationLevel}%</span>
                        </div>
                        <Slider
                          id="collaboration"
                          min={0}
                          max={100}
                          step={10}
                          value={[collaborationLevel]}
                          onValueChange={(value) => setCollaborationLevel(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Higher values encourage more debate between agents with different perspectives.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="visibility" className="mb-1 block">Agent Visibility</Label>
                          <p className="text-xs text-muted-foreground">
                            Show agent decision process in real-time
                          </p>
                        </div>
                        <Switch
                          id="visibility"
                          checked={agentVisibility}
                          onCheckedChange={setAgentVisibility}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Saving..." : "Save Settings"}
                </Button>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={handleRunSimulation}
                  disabled={isProcessing || activeAgents.length === 0}
                >
                  Run Agent Simulation
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-secondary/30 border-border/50 h-full">
                <CardHeader>
                  <CardTitle>Agent Visualization</CardTitle>
                  <CardDescription>
                    See how your selected agents will collaborate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center">
                    <AgentVisualizer 
                      projectId={projectId}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Selected Agents</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeAgents.length > 0 ? (
                        activeAgents.map((agentId) => {
                          const allAgents = [...methodologies, ...theoreticalFrameworks, ...crossCheckingMethods];
                          const agent = allAgents.find(a => a.value === agentId);
                          return (
                            <Badge key={agentId} variant="secondary">
                              {agent?.label || agentId}
                            </Badge>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">No agents selected</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Agent Status</h4>
                    <div className="text-sm">
                      {activeAgents.length > 0 ? (
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Ready to collaborate</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                          <span>Awaiting configuration</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

interface AgentCardProps {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
}

const AgentCard = ({ id, title, description, isActive, onToggle }: AgentCardProps) => {
  return (
    <Card className={`border transition-all duration-300 ${
      isActive ? 'border-primary/50 bg-primary/5' : 'border-border/50'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Switch checked={isActive} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <div className={`h-2 w-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          {isActive ? 'Active' : 'Inactive'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentSettings;
