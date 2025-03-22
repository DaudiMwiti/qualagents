
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Agent,
  AgentPersona,
  agentService
} from "@/services/agentService";
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
  Brain,
  User,
  FileText,
  Pin,
  Save,
  Plus,
  Edit,
  Check,
  Trash2,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const AgentCustomization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Partial<Agent>>({
    name: "My Custom Agent",
    type: "custom",
    status: "idle",
    insights: []
  });
  const [personas, setPersonas] = useState<AgentPersona[]>([]);
  const [methodologies, setMethodologies] = useState<{id: string; name: string; description: string}[]>([]);
  const [pinnedMethodologies, setPinnedMethodologies] = useState<string[]>([]);
  
  useEffect(() => {
    // Load personas and methodologies
    setPersonas(agentService.getPersonas());
    setMethodologies(agentService.getMethodologies());
  }, []);
  
  const handleCreateAgent = async () => {
    setIsLoading(true);
    
    try {
      const newAgent = await agentService.createCustomAgent({
        ...currentAgent,
        pinnedMethodologies
      });
      
      toast({
        title: "Agent created",
        description: `${newAgent.name} has been created successfully.`,
      });
      
      navigate("/agent-settings");
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Error creating agent",
        description: "There was a problem creating your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePromptChange = (prompt: string) => {
    setCurrentAgent(prev => ({
      ...prev,
      prompt
    }));
  };
  
  const handlePersonaSelect = (persona: AgentPersona) => {
    setCurrentAgent(prev => ({
      ...prev,
      persona
    }));
  };
  
  const handleToggleMethodology = (methodologyId: string) => {
    setPinnedMethodologies(prev => {
      if (prev.includes(methodologyId)) {
        return prev.filter(id => id !== methodologyId);
      } else {
        return [...prev, methodologyId];
      }
    });
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
            <h1 className="text-3xl font-semibold">Design Your Research Agent</h1>
            <p className="text-muted-foreground mt-1">
              Customize a research agent with specialized capabilities for your projects
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="general">
                    <Brain className="mr-2 h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="prompt">
                    <FileText className="mr-2 h-4 w-4" />
                    Prompt Editor
                  </TabsTrigger>
                  <TabsTrigger value="persona">
                    <User className="mr-2 h-4 w-4" />
                    Persona
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Configuration</CardTitle>
                      <CardDescription>
                        Set the core properties of your research agent
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="agent-name">Agent Name</Label>
                        <Input 
                          id="agent-name" 
                          value={currentAgent.name}
                          onChange={(e) => setCurrentAgent(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter a name for your agent"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="agent-type">Agent Type</Label>
                        <Input 
                          id="agent-type" 
                          value={currentAgent.type}
                          onChange={(e) => setCurrentAgent(prev => ({ ...prev, type: e.target.value }))}
                          placeholder="Methodology, Framework, Validation, etc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Pinned Methodologies</Label>
                        <div className="flex flex-wrap gap-2">
                          {pinnedMethodologies.length > 0 ? (
                            methodologies
                              .filter(m => pinnedMethodologies.includes(m.id))
                              .map(methodology => (
                                <Badge 
                                  key={methodology.id}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  <Pin className="h-3 w-3" />
                                  {methodology.name}
                                </Badge>
                              ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No methodologies pinned. Go to the Methodologies tab to pin some.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Pin className="h-5 w-5 text-primary inline mr-2" />
                        Pin Methodologies
                      </CardTitle>
                      <CardDescription>
                        Select specific methodologies for this agent to use
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {methodologies.map(methodology => (
                          <div 
                            key={methodology.id}
                            className={`p-3 rounded-md border cursor-pointer transition-all ${
                              pinnedMethodologies.includes(methodology.id) 
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-border hover:border-primary/30 hover:bg-secondary/30'
                            }`}
                            onClick={() => handleToggleMethodology(methodology.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-base flex items-center">
                                  {methodology.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {methodology.description}
                                </p>
                              </div>
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                pinnedMethodologies.includes(methodology.id) 
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary'
                              }`}>
                                {pinnedMethodologies.includes(methodology.id) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="prompt" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Agent Prompt Editor</CardTitle>
                      <CardDescription>
                        Customize how your agent approaches research analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="You are a qualitative research AI assistant specialized in analyzing interview data. Your task is to identify key themes, patterns, and insights in the provided data..."
                          className="min-h-[300px] font-mono text-sm"
                          value={currentAgent.prompt || ""}
                          onChange={(e) => handlePromptChange(e.target.value)}
                        />
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            onClick={() => handlePromptChange("")}
                            size="sm"
                          >
                            Clear
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handlePromptChange("You are a qualitative research AI assistant specialized in analyzing interview data. Your task is to identify key themes, patterns, and insights in the provided data while following these guidelines:\n\n1. Apply rigorous methodological approaches to your analysis\n2. Consider multiple theoretical perspectives\n3. Highlight direct quotes that support your findings\n4. Note any limitations or potential biases in your analysis\n5. Suggest areas for further investigation");
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Prompt Tips</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Start with a clear definition of the agent's role and purpose</li>
                        <li>• Include specific methodological approaches you want the agent to follow</li>
                        <li>• Specify any biases or perspectives you want the agent to be aware of</li>
                        <li>• Define the format and structure of the insights you want to receive</li>
                      </ul>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="persona" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Agent Persona</CardTitle>
                      <CardDescription>
                        Choose a theoretical persona that defines how your agent approaches analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {personas.map(persona => (
                          <div 
                            key={persona.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              currentAgent.persona?.id === persona.id 
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-border hover:border-primary/30 hover:bg-secondary/30'
                            }`}
                            onClick={() => handlePersonaSelect(persona)}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {persona.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{persona.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {persona.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {persona.traits.map((trait, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {trait}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start border-t pt-4">
                      <div className="w-full flex justify-between items-center">
                        <h4 className="text-sm font-medium">Create Custom Persona</h4>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New
                        </Button>
                      </div>
                      <Separator className="my-3" />
                      <p className="text-xs text-muted-foreground">
                        Custom personas allow you to define unique theoretical approaches and perspectives
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/agent-settings")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAgent}
                  disabled={isLoading || !currentAgent.name}
                >
                  {isLoading ? "Creating..." : "Create Agent"}
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-card/90 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Agent Preview</CardTitle>
                  <CardDescription>
                    Current configuration preview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{currentAgent.name || "Custom Agent"}</h3>
                        <p className="text-xs text-muted-foreground">{currentAgent.type}</p>
                      </div>
                    </div>
                    
                    {currentAgent.persona && (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">PERSONA</div>
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-primary" />
                          <span className="text-sm">{currentAgent.persona.name}</span>
                        </div>
                      </div>
                    )}
                    
                    {pinnedMethodologies.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">METHODOLOGIES</div>
                        <div className="flex flex-wrap gap-1">
                          {pinnedMethodologies.map(id => {
                            const method = methodologies.find(m => m.id === id);
                            return (
                              <Badge key={id} variant="outline" className="text-xs flex items-center">
                                <Pin className="h-3 w-3 mr-1" />
                                {method?.name || id}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {currentAgent.prompt && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">PROMPT PREVIEW</div>
                        <div className="text-xs bg-background/50 p-2 rounded max-h-32 overflow-y-auto">
                          {currentAgent.prompt.substring(0, 150)}
                          {currentAgent.prompt.length > 150 && "..."}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Configuration Status</h4>
                    {!currentAgent.name && (
                      <div className="flex items-center text-amber-500 text-sm mb-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        Agent name required
                      </div>
                    )}
                    {!currentAgent.persona && (
                      <div className="flex items-center text-amber-500 text-sm mb-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        No persona selected
                      </div>
                    )}
                    {pinnedMethodologies.length === 0 && (
                      <div className="flex items-center text-amber-500 text-sm mb-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        No methodologies pinned
                      </div>
                    )}
                    {!currentAgent.prompt && (
                      <div className="flex items-center text-amber-500 text-sm mb-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        No prompt defined
                      </div>
                    )}
                    {currentAgent.name && currentAgent.persona && pinnedMethodologies.length > 0 && currentAgent.prompt && (
                      <div className="flex items-center text-green-500 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        Agent configuration complete
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start border-t pt-4">
                  <Button 
                    variant="default" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    disabled={isLoading || !currentAgent.name}
                    onClick={handleCreateAgent}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Creating..." : "Create Agent"}
                  </Button>
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

export default AgentCustomization;
