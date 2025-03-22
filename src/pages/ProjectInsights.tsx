
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Brain, LineChart, PieChart, TrendingUp } from "lucide-react";
import { projectService, Project } from "@/services/projectService";
import { insightsService } from "@/services/insightsService";
import type { ProjectInsights as ProjectInsightsType } from "@/services/insightsService";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import { MetricCard } from "@/components/insights/MetricCard";
import { ProjectHeader } from "@/components/insights/ProjectHeader";
import { OverviewTab } from "@/components/insights/tabs/OverviewTab";
import { ThemesTab } from "@/components/insights/tabs/ThemesTab";
import { TrendsTab } from "@/components/insights/tabs/TrendsTab";
import { InsightsTab } from "@/components/insights/tabs/InsightsTab";

// Constants
const COLORS = ["#8B5CF6", "#22D3EE", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

const ProjectInsights = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [insights, setInsights] = useState<ProjectInsightsType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!id) {
      navigate("/dashboard");
      return;
    }
    
    setLoading(true);
    
    const projectData = projectService.getProject(id);
    if (!projectData) {
      toast({
        title: "Project not found",
        description: "The requested project could not be found",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    
    setProject(projectData);
    
    const insightsData = insightsService.getProjectInsights(id);
    setInsights(insightsData);
    
    setLoading(false);
  }, [id, navigate, toast]);
  
  if (loading) {
    return (
      <PageTransition>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading insights...</p>
            </div>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }
  
  if (!project || !insights) {
    return (
      <PageTransition>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Insights Available</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any insights for this project.
                </p>
                <Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                  Return to Dashboard
                </Link>
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
            <ProjectHeader project={project} insights={insights} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {insights.metrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
            
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-6 bg-secondary/50">
                <TabsTrigger value="overview" className="flex">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex">
                  <PieChart className="h-4 w-4 mr-2" />
                  Themes
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex">
                  <Brain className="h-4 w-4 mr-2" />
                  Key Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <OverviewTab insights={insights} colors={COLORS} />
              </TabsContent>
              
              <TabsContent value="themes">
                <ThemesTab insights={insights} />
              </TabsContent>
              
              <TabsContent value="trends">
                <TrendsTab insights={insights} colors={COLORS} />
              </TabsContent>
              
              <TabsContent value="insights">
                <InsightsTab insights={insights} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default ProjectInsights;
