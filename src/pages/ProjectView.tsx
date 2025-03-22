import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AgentVisualizer from "@/components/project/AgentVisualizer";
import AgentChat from "@/components/project/AgentChat";
import AgentExplainability from "@/components/project/AgentExplainability";
import ProjectCreationForm from "@/components/project/ProjectCreationForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BarChart,
  FileText,
  MessageSquare,
  Settings,
  Upload,
  Users,
  Brain,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Agent } from "@/types/agent";
import { projectService, Project } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAgents, setActiveAgents] = useState<string[]>([
    "grounded-theory", "feminist-theory", "bias-identification"
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (id && id !== "new") {
      setLoading(true);
      const projectData = projectService.getProject(id);
      
      if (projectData) {
        setProject(projectData);
      } else {
        toast({
          title: "Project not found",
          description: "The requested project could not be found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
      
      setLoading(false);
    }
  }, [id, navigate, toast]);
  
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };
  
  if (id === "new") {
    return (
      <PageTransition>
        <Navbar />
        <NewProjectPage />
        <Footer />
      </PageTransition>
    );
  }
  
  if (loading) {
    return (
      <PageTransition>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading project...</p>
            </div>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }
  
  if (!project) {
    return (
      <PageTransition>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  The project you're looking for doesn't exist or has been deleted.
                </p>
                <Button asChild>
                  <Link to="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="mr-2 h-8 w-8"
                >
                  <Link to="/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-semibold mr-3">
                      {project.title}
                    </h1>
                    <Badge
                      variant={
                        project.status === "completed"
                          ? "default"
                          : project.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status === "in-progress"
                        ? "In Progress"
                        : project.status === "completed"
                        ? "Completed"
                        : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {project.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="h-9">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  asChild
                  className="h-9"
                >
                  <Link to={`/data-upload/${id}`}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Data
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="default"
                  className="h-9"
                >
                  <Link to={`/project-insights/${id}`}>
                    <BarChart className="mr-2 h-4 w-4" />
                    View Insights
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 mt-4 mb-8">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-1.5" />
                {project.documents} Documents
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1.5" />
                {project.collaborators} Collaborators
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.methodologies.map((methodology) => (
                  <Badge
                    key={methodology}
                    variant="secondary"
                    className="font-normal"
                  >
                    {methodology}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator className="mb-8" />
            
            <Tabs defaultValue="agents">
              <TabsList className="mb-8 bg-secondary/50">
                <TabsTrigger value="agents" className="flex">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Agents
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Agent Chat
                </TabsTrigger>
                <TabsTrigger value="explain" className="flex">
                  <Info className="h-4 w-4 mr-2" />
                  Explainability
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex">
                  <BarChart className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="data" className="flex">
                  <FileText className="h-4 w-4 mr-2" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="team" className="flex">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="agents" className="m-0">
                <AgentVisualizer 
                  projectId={project.id} 
                  onAgentSelect={handleAgentSelect}
                />
              </TabsContent>
              
              <TabsContent value="chat" className="m-0">
                <div className="h-[600px]">
                  <AgentChat projectId={project.id} activeAgents={activeAgents} />
                </div>
              </TabsContent>
              
              <TabsContent value="explain" className="m-0">
                {selectedAgent ? (
                  <AgentExplainability agent={selectedAgent} />
                ) : (
                  <div className="glass-card p-8 text-center">
                    <Info className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Agent Explainability</h3>
                    <p className="text-muted-foreground mb-6">
                      Select an agent from the "AI Agents" tab to see detailed explanation of its reasoning process.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => document.querySelector('[data-value="agents"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      )}
                    >
                      Go to Agents Tab
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="insights" className="m-0">
                <div className="glass-card p-8">
                  <h3 className="text-xl font-medium mb-6">Research Insights</h3>
                  <p className="text-muted-foreground mb-6">
                    This section will display aggregated insights from all agents, organized by themes and categories.
                  </p>
                  <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                      <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-2">Access the Complete Insights Dashboard</p>
                      <p className="text-sm text-muted-foreground mb-6">
                        View comprehensive data visualizations, trends, and key findings
                      </p>
                      <Button asChild>
                        <Link to={`/project-insights/${id}`}>
                          <BarChart className="mr-2 h-4 w-4" />
                          Open Insights Dashboard 
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="data" className="m-0">
                <div className="glass-card p-8">
                  <h3 className="text-xl font-medium mb-6">Project Data</h3>
                  <p className="text-muted-foreground">
                    View and manage the data sources for this project.
                  </p>
                  <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium">No Data Sources Yet</p>
                      <p className="text-sm text-muted-foreground mt-2 mb-6">
                        Upload documents to begin analysis
                      </p>
                      <Button asChild>
                        <Link to={`/data-upload/${id}`}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Documents
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="m-0">
                <div className="glass-card p-8">
                  <h3 className="text-xl font-medium mb-6">Team Collaboration</h3>
                  <p className="text-muted-foreground">
                    Manage team members and collaborators for this project.
                  </p>
                  <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium">Team Members</p>
                      <p className="text-sm text-muted-foreground mt-2 mb-6">
                        {project.collaborators > 0
                          ? `This project has ${project.collaborators} collaborators`
                          : "No collaborators yet"}
                      </p>
                      <Button>
                        <Users className="mr-2 h-4 w-4" />
                        Invite Collaborators
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

const NewProjectPage = () => {
  return (
    <main className="pt-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        >
          <div className="flex items-center mb-6">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="mr-2 h-8 w-8"
            >
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Create New Project
            </h1>
          </div>
          
          <ProjectCreationForm />
        </motion.div>
      </div>
    </main>
  );
};

export default ProjectView;
