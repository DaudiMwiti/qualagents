
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Edit, 
  Trash, 
  Save, 
  X, 
  Plus,
  Settings,
  RefreshCw
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { agentService } from "@/services/agentService";
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

const AgentSettings = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        const fetchedAgents = await agentService.getAgents();
        setAgents(fetchedAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Error fetching agents",
          description: "Failed to load the list of AI Agents.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

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
    }
  };

  const handleSaveClick = async () => {
    if (!selectedAgent) return;
    
    try {
      setIsLoading(true);
      const updatedAgent = {
        ...selectedAgent,
        name: newAgentName,
        description: newAgentDescription,
        model: newAgentModel,
        temperature: newAgentTemperature,
        max_tokens: newAgentMaxTokens,
        prompt: newAgentPrompt,
        is_active: isAgentActive,
        is_public: isAgentPublic,
        is_safe_mode: isAgentSafeMode,
        is_streaming: isAgentStreaming,
        is_context_aware: isAgentContextAware,
        is_knowledge_enabled: isAgentKnowledgeEnabled,
        is_tools_enabled: isAgentToolsEnabled,
        is_reasoning_enabled: isAgentReasoningEnabled,
        is_memory_enabled: isAgentMemoryEnabled,
        is_goals_enabled: isAgentGoalsEnabled,
        is_constraints_enabled: isAgentConstraintsEnabled,
      };
      
      // Use the updated function signature
      await agentService.updateAgent(updatedAgent);
      
      setAgents(agents.map(agent => 
        agent.id === selectedAgent.id ? updatedAgent : agent
      ));
      
      setSelectedAgent(updatedAgent);
      setIsEditing(false);
      
      toast({
        title: "Agent updated",
        description: "The AI agent has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error updating agent",
        description: "Failed to update the AI agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = async () => {
    try {
      setIsLoading(true);
      const newAgent = {
        name: "New Agent",
        description: "A new AI agent",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 200,
        prompt: "",
        is_active: true,
        is_public: false,
        is_safe_mode: true,
        is_streaming: false,
        is_context_aware: true,
        is_knowledge_enabled: true,
        is_tools_enabled: true,
        is_reasoning_enabled: true,
        is_memory_enabled: true,
        is_goals_enabled: true,
        is_constraints_enabled: true,
      };
      
      // Use the updated function signature
      const createdAgent = await agentService.createAgent(newAgent);
      
      setAgents([...agents, createdAgent]);
      handleAgentSelect(createdAgent);
      setIsEditing(true);
      
      toast({
        title: "Agent created",
        description: "A new AI agent has been created. You can now customize it.",
      });
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Error creating agent",
        description: "Failed to create a new AI agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedAgent) return;
    
    try {
      setIsLoading(true);
      // Use the updated function signature
      await agentService.deleteAgent(selectedAgent.id);
      
      setAgents(agents.filter(agent => agent.id !== selectedAgent.id));
      setSelectedAgent(null);
      
      toast({
        title: "Agent deleted",
        description: "The AI agent has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error deleting agent",
        description: "Failed to delete the AI agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-semibold mb-2">AI Agent Settings</h1>
                <p className="text-muted-foreground">
                  Configure your AI agents and their capabilities
                </p>
              </div>
              <Button onClick={handleCreateClick} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium mb-4">Available Agents</h2>
                {isLoading && !agents.length ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {agents.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No agents found. Create your first agent to get started.
                      </p>
                    ) : (
                      agents.map(agent => (
                        <div
                          key={agent.id}
                          className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                            selectedAgent?.id === agent.id
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-secondary/50"
                          }`}
                          onClick={() => handleAgentSelect(agent)}
                        >
                          <div className="flex items-center">
                            <Brain className="h-5 w-5 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {agent.model}
                              </p>
                            </div>
                          </div>
                          {agent.is_active ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {selectedAgent ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl">
                      {isEditing ? "Edit Agent" : selectedAgent.name}
                    </CardTitle>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={handleCancelClick} disabled={isLoading}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveClick} disabled={isLoading}>
                            {isLoading ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="text-destructive hover:bg-destructive/10" disabled={isLoading}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete AI Agent</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this AI agent? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteClick} 
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button onClick={handleEditClick} disabled={isLoading}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoading && isEditing ? (
                      <div className="flex justify-center py-8">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            {isEditing ? (
                              <Input
                                id="name"
                                value={newAgentName}
                                onChange={(e) => setNewAgentName(e.target.value)}
                                placeholder="Enter agent name"
                              />
                            ) : (
                              <p className="text-lg">{selectedAgent.name}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            {isEditing ? (
                              <Textarea
                                id="description"
                                value={newAgentDescription}
                                onChange={(e) => setNewAgentDescription(e.target.value)}
                                placeholder="Enter agent description"
                                rows={3}
                              />
                            ) : (
                              <p className="text-muted-foreground">
                                {selectedAgent.description || "No description provided."}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            {isEditing ? (
                              <Input
                                id="model"
                                value={newAgentModel}
                                onChange={(e) => setNewAgentModel(e.target.value)}
                                placeholder="e.g., gpt-3.5-turbo"
                              />
                            ) : (
                              <p>{selectedAgent.model}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="temperature">Temperature: {isEditing ? newAgentTemperature : selectedAgent.temperature}</Label>
                            </div>
                            {isEditing ? (
                              <Slider
                                id="temperature"
                                value={[newAgentTemperature]}
                                min={0}
                                max={1}
                                step={0.1}
                                onValueChange={(vals) => setNewAgentTemperature(vals[0])}
                              />
                            ) : (
                              <div className="h-5 bg-secondary/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${selectedAgent.temperature * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="maxTokens">Max Tokens</Label>
                            {isEditing ? (
                              <Input
                                id="maxTokens"
                                type="number"
                                value={newAgentMaxTokens}
                                onChange={(e) => setNewAgentMaxTokens(parseInt(e.target.value))}
                                placeholder="e.g., 2000"
                              />
                            ) : (
                              <p>{selectedAgent.max_tokens}</p>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="prompt">System Prompt</Label>
                          {isEditing ? (
                            <Textarea
                              id="prompt"
                              value={newAgentPrompt}
                              onChange={(e) => setNewAgentPrompt(e.target.value)}
                              placeholder="Enter system prompt for the agent"
                              rows={5}
                            />
                          ) : (
                            <p className="p-3 bg-secondary/30 rounded-md text-sm font-mono whitespace-pre-wrap">
                              {selectedAgent.prompt || "No system prompt provided."}
                            </p>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Agent Settings</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="active" className="cursor-pointer">Active</Label>
                              {isEditing ? (
                                <Switch
                                  id="active"
                                  checked={isAgentActive}
                                  onCheckedChange={setIsAgentActive}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_active ? "default" : "outline"}>
                                  {selectedAgent.is_active ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="public" className="cursor-pointer">Public</Label>
                              {isEditing ? (
                                <Switch
                                  id="public"
                                  checked={isAgentPublic}
                                  onCheckedChange={setIsAgentPublic}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_public ? "default" : "outline"}>
                                  {selectedAgent.is_public ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="safeMode" className="cursor-pointer">Safe Mode</Label>
                              {isEditing ? (
                                <Switch
                                  id="safeMode"
                                  checked={isAgentSafeMode}
                                  onCheckedChange={setIsAgentSafeMode}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_safe_mode ? "default" : "outline"}>
                                  {selectedAgent.is_safe_mode ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="streaming" className="cursor-pointer">Streaming</Label>
                              {isEditing ? (
                                <Switch
                                  id="streaming"
                                  checked={isAgentStreaming}
                                  onCheckedChange={setIsAgentStreaming}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_streaming ? "default" : "outline"}>
                                  {selectedAgent.is_streaming ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="contextAware" className="cursor-pointer">Context Aware</Label>
                              {isEditing ? (
                                <Switch
                                  id="contextAware"
                                  checked={isAgentContextAware}
                                  onCheckedChange={setIsAgentContextAware}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_context_aware ? "default" : "outline"}>
                                  {selectedAgent.is_context_aware ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="knowledgeEnabled" className="cursor-pointer">Knowledge Enabled</Label>
                              {isEditing ? (
                                <Switch
                                  id="knowledgeEnabled"
                                  checked={isAgentKnowledgeEnabled}
                                  onCheckedChange={setIsAgentKnowledgeEnabled}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_knowledge_enabled ? "default" : "outline"}>
                                  {selectedAgent.is_knowledge_enabled ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="toolsEnabled" className="cursor-pointer">Tools Enabled</Label>
                              {isEditing ? (
                                <Switch
                                  id="toolsEnabled"
                                  checked={isAgentToolsEnabled}
                                  onCheckedChange={setIsAgentToolsEnabled}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_tools_enabled ? "default" : "outline"}>
                                  {selectedAgent.is_tools_enabled ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="reasoningEnabled" className="cursor-pointer">Reasoning Enabled</Label>
                              {isEditing ? (
                                <Switch
                                  id="reasoningEnabled"
                                  checked={isAgentReasoningEnabled}
                                  onCheckedChange={setIsAgentReasoningEnabled}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_reasoning_enabled ? "default" : "outline"}>
                                  {selectedAgent.is_reasoning_enabled ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="memoryEnabled" className="cursor-pointer">Memory Enabled</Label>
                              {isEditing ? (
                                <Switch
                                  id="memoryEnabled"
                                  checked={isAgentMemoryEnabled}
                                  onCheckedChange={setIsAgentMemoryEnabled}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_memory_enabled ? "default" : "outline"}>
                                  {selectedAgent.is_memory_enabled ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="goalsEnabled" className="cursor-pointer">Goals Enabled</Label>
                              {isEditing ? (
                                <Switch
                                  id="goalsEnabled"
                                  checked={isAgentGoalsEnabled}
                                  onCheckedChange={setIsAgentGoalsEnabled}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_goals_enabled ? "default" : "outline"}>
                                  {selectedAgent.is_goals_enabled ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="constraintsEnabled" className="cursor-pointer">Constraints Enabled</Label>
                              {isEditing ? (
                                <Switch
                                  id="constraintsEnabled"
                                  checked={isAgentConstraintsEnabled}
                                  onCheckedChange={setIsAgentConstraintsEnabled}
                                />
                              ) : (
                                <Badge variant={selectedAgent.is_constraints_enabled ? "default" : "outline"}>
                                  {selectedAgent.is_constraints_enabled ? "Yes" : "No"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-12">
                    <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Agent Selected</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Select an agent from the list to view or edit its settings, or create a new agent to get started.
                    </p>
                    <Button onClick={handleCreateClick} disabled={isLoading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Agent
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
};

export default AgentSettings;
