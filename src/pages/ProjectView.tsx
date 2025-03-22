
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AgentVisualizer from "@/components/project/AgentVisualizer";
import AgentChat from "@/components/project/AgentChat";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Agent } from "@/services/agentService";

// Mock data project
const mockProject = {
  id: "proj-1",
  title: "Patient Experience Analysis",
  description: "Investigating patient narratives about telehealth experiences during the pandemic.",
  date: "June 2, 2023",
  methodologies: ["Grounded Theory", "Phenomenology"],
  collaborators: 2,
  documents: 8,
  status: "in-progress",
};

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(mockProject);
  const [activeAgents, setActiveAgents] = useState<string[]>([
    "grounded-theory", "feminist-theory", "bias-identification"
  ]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // This would fetch project data from an API in a real application
    if (id && id !== "new") {
      // Fetch project data
      console.log("Fetching project with ID:", id);
    }
  }, [id]);
  
  // If this is a new project page
  if (id === "new") {
    return (
      <PageTransition>
        <Navbar />
        <NewProjectPage />
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
              
              <div className="flex space-x-2">
                <Button variant="outline" className="h-9">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button className="h-9">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Data
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
                <AgentVisualizer projectId={project.id} />
              </TabsContent>
              
              <TabsContent value="chat" className="m-0">
                <div className="h-[600px]">
                  <AgentChat projectId={project.id} activeAgents={activeAgents} />
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="m-0">
                <div className="glass-card p-8">
                  <h3 className="text-xl font-medium mb-6">Research Insights</h3>
                  <p className="text-muted-foreground">
                    This section will display aggregated insights from all agents, organized by themes and categories.
                  </p>
                  <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                      <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium">Insight Visualization Coming Soon</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Insights will appear here as AI agents analyze your data
                      </p>
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
                      <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Documents
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
          
          <div className="glass-card p-8">
            <h3 className="text-xl font-medium mb-6">New Project Setup</h3>
            <p className="text-muted-foreground mb-8">
              Configure your new research project and select the AI agents you want to use.
            </p>
            
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium">Project Creation Coming Soon</p>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  This feature is currently under development
                </p>
                <Button asChild>
                  <Link to="/dashboard">
                    Return to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default ProjectView;
