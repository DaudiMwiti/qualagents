import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  LineChart,
  PieChart,
  ThumbsUp,
  TrendingUp,
  Download,
  Filter,
  MessageSquare,
  Share2,
  Info,
  Star,
  FileText,
  FileJson,
  Table as TableIcon,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { projectService, Project } from "@/services/projectService";
import { insightsService, InsightMetric, InsightCategory, InsightTrend, InsightSummary } from "@/services/insightsService";
import type { ProjectInsights } from "@/services/insightsService";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart as RechartLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportAsPdf, exportAsMarkdown, exportAsCsv, exportAsJson } from "@/utils/exportUtils";

const COLORS = ["#8B5CF6", "#22D3EE", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

const ProjectInsights = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [insights, setInsights] = useState<ProjectInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
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
  
  const handleExport = async (format: 'pdf' | 'markdown' | 'csv' | 'json') => {
    if (!project || !insights) return;
    
    setExporting(true);
    
    try {
      let success = false;
      
      switch (format) {
        case 'pdf':
          success = await exportAsPdf(project, insights);
          break;
        case 'markdown':
          success = exportAsMarkdown(project, insights);
          break;
        case 'csv':
          success = exportAsCsv(project, insights);
          break;
        case 'json':
          success = exportAsJson(project, insights);
          break;
      }
      
      if (success) {
        toast({
          title: "Export successful",
          description: `Insights exported successfully as ${format.toUpperCase()}!`,
        });
      } else {
        throw new Error(`Failed to export as ${format}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: `There was a problem exporting your insights. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };
  
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
                  <Link to={`/project/${id}`}>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-semibold mr-3">
                      {project.title} Insights
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
                    Analysis results and key findings
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="h-9">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className="h-9"
                      disabled={exporting}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {exporting ? "Exporting..." : "Export Report"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('markdown')}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Export as Markdown (.md)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      <TableIcon className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json')}>
                      <FileJson className="mr-2 h-4 w-4" />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
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
              
              <TabsContent value="overview" className="m-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Distribution by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ChartContainer config={{
                          primary: { theme: { light: "#8B5CF6", dark: "#A78BFA" } },
                          secondary: { theme: { light: "#22D3EE", dark: "#67E8F9" } },
                          tertiary: { theme: { light: "#10B981", dark: "#34D399" } },
                          quaternary: { theme: { light: "#F59E0B", dark: "#FBBF24" } },
                          quinary: { theme: { light: "#EF4444", dark: "#F87171" } },
                        }}>
                          <BarChart data={insights.categories} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                            />
                            <Bar dataKey="count" fill="var(--color-primary)" name="Count" />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Distribution by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartPieChart>
                            <Pie
                              data={insights.categories}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {insights.categories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Top Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {insights.topInsights.slice(0, 3).map((insight) => (
                          <div key={insight.id} className="p-4 border rounded-lg">
                            <div className="flex items-start gap-4">
                              <div className="bg-primary/10 rounded-full p-2">
                                <Brain className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{insight.agentName}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {insight.methodology}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <CalendarDays className="h-3 w-3 mr-1" />
                                    {insight.date}
                                  </div>
                                </div>
                                <p className="text-sm mb-3">{insight.text}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    <span>Relevance: {insight.relevance}%</span>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs h-7">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Discuss
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-center">
                          <Button variant="outline" onClick={() => document.querySelector('[data-value="insights"]')?.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                          )}>
                            View All Insights
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="themes" className="m-0">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Thematic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ComposedChartThemes data={insights.thematicClusters} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {insights.thematicClusters.map((cluster) => (
                      <Card key={cluster.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">{cluster.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Weight</span>
                              <span className="text-sm font-medium">{cluster.value}</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${(cluster.value / Math.max(...insights.thematicClusters.map(c => c.value))) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {cluster.children?.map((child) => (
                              <div key={child.id}>
                                <div className="flex justify-between text-sm">
                                  <span>{child.name}</span>
                                  <span>{child.value}</span>
                                </div>
                                <div className="h-1.5 bg-secondary/50 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className="h-full bg-primary/60"
                                    style={{
                                      width: `${(child.value / cluster.value) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="m-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">
                      <div className="flex justify-between items-center">
                        <span>Trend Analysis Over Time</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                            <Filter className="h-3 w-3 mr-1" />
                            Filter
                          </Button>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartLineChart
                          data={insights.trends}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {Array.from(new Set(insights.trends.map(item => item.category))).map((category, index) => (
                            <Line
                              key={String(category)}
                              type="monotone"
                              dataKey="value"
                              name={String(category)}
                              stroke={COLORS[index % COLORS.length]}
                              activeDot={{ r: 8 }}
                              data={insights.trends.filter(item => item.category === category)}
                            />
                          ))}
                        </RechartLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Growth Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={insights.trends.filter(t => t.category === insights.categories[0]?.name)}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="m-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">
                      <div className="flex justify-between items-center">
                        <span>All Insights</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                            <Filter className="h-3 w-3 mr-1" />
                            Filter by Agent
                          </Button>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {insights.topInsights.map((insight) => (
                        <div key={insight.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 rounded-full p-2">
                              <Brain className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{insight.agentName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {insight.methodology}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <CalendarDays className="h-3 w-3 mr-1" />
                                  {insight.date}
                                </div>
                              </div>
                              <p className="text-sm mb-3">{insight.text}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="h-3 w-3 mr-1" />
                                  <span>Relevance: {insight.relevance}%</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="text-xs h-7">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Validate
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-xs h-7">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Discuss
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

const MetricCard = ({ metric }: { metric: InsightMetric }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{metric.name}</h3>
          <div 
            className={`flex items-center gap-1 text-xs font-medium ${
              metric.status === "positive" 
                ? "text-green-500" 
                : metric.status === "negative" 
                ? "text-red-500" 
                : "text-gray-500"
            }`}
          >
            {metric.change !== undefined && (
              <>
                {metric.change > 0 ? "+" : ""}{metric.change}%
                {metric.status === "positive" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : metric.status === "negative" ? (
                  <TrendingUp className="h-3 w-3 rotate-180" />
                ) : null}
              </>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{metric.value}</span>
          {metric.description && (
            <div className="tooltip" data-tip={metric.description}>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ComposedChartThemes = ({ data }: { data: any[] }) => {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
    subthemes: item.children?.length || 0
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Weight" barSize={60} fill="#8B5CF6" />
        <Line type="monotone" dataKey="subthemes" name="Subthemes" stroke="#22D3EE" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ProjectInsights;
