
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart, Brain, Loader2, AlertCircle, FileText, Lightbulb, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { analysisService, AnalysisStatus, AnalysisResult } from "@/services/analysisService";
import { InsightsTab } from "@/components/insights/tabs/InsightsTab";
import { ProjectInsights } from "@/services/insightsService";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";

const AnalysisResults = () => {
  const { projectId, batchId } = useParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNotifiedCompletion, setHasNotifiedCompletion] = useState(false);
  
  useEffect(() => {
    if (!batchId) return;
    
    fetchStatus();
    
    const intervalId = setInterval(fetchStatus, 2000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [batchId]);
  
  const fetchStatus = async () => {
    if (!batchId) return;
    
    try {
      const currentStatus = await analysisService.getAnalysisStatus(batchId);
      setStatus(currentStatus);
      
      if (currentStatus.status === 'completed' && !hasNotifiedCompletion) {
        // Show a toast notification when analysis completes
        toast({
          title: "Analysis Complete!",
          description: "Your document analysis has finished successfully.",
          duration: 5000,
        });
        setHasNotifiedCompletion(true);
        
        const analysisResults = await analysisService.getAnalysisResults(batchId);
        setResults(analysisResults);
        setLoading(false);
      } else if (currentStatus.status === 'failed') {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: currentStatus.error || "There was a problem with your analysis.",
          duration: 5000,
        });
        setError(currentStatus.error || "Analysis failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching analysis status:", error);
      setError("Failed to fetch analysis status");
      setLoading(false);
    }
  };
  
  if (loading && (!status || status.status === 'queued' || status.status === 'processing')) {
    return (
      <PageTransition>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center mb-6">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="mr-2 h-8 w-8"
              >
                <Link to={`/project/${projectId}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    Analysis in Progress
                  </h1>
                  <StatusBadge 
                    status={status?.status === 'queued' ? 'draft' : 'processing'} 
                    processing={status?.status === 'processing'}
                    size="lg"
                  />
                </div>
              </div>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Processing Your Documents</CardTitle>
                <CardDescription>
                  Your AI agents are analyzing the data. This may take a few minutes depending on the size of your dataset.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {status?.status === 'queued' ? 'Queued' : 'Processing'}
                    </span>
                    <span>{status?.progress ?? 0}%</span>
                  </div>
                  
                  <Progress value={status?.progress ?? 0} className="h-2" />
                  
                  <div className="flex justify-center pt-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    {status?.status === 'queued' 
                      ? "Your analysis is in the queue and will start soon..."
                      : "AI agents are working on extracting insights from your data..."}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link to={`/project/${projectId}`}>
                  Return to Project
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }
  
  if (error) {
    return (
      <PageTransition>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center mb-6">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="mr-2 h-8 w-8"
              >
                <Link to={`/project/${projectId}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    Analysis Error
                  </h1>
                  <StatusBadge status="failed" size="lg" />
                </div>
              </div>
            </div>
            
            <Card className="mb-8 border-destructive">
              <CardHeader>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                  <CardTitle>Analysis Failed</CardTitle>
                </div>
                <CardDescription>
                  There was an error processing your analysis request.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-destructive">{error}</p>
                
                <div className="mt-6 flex justify-center">
                  <Button asChild>
                    <Link to={`/project/${projectId}`}>
                      Return to Project
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }
  
  if (!results) {
    return (
      <PageTransition>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading results...</p>
            </div>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }
  
  const insightsData: ProjectInsights = {
    topInsights: results.insights.map(insight => ({
      id: insight.id,
      text: insight.text,
      agentId: insight.agentId,
      agentName: insight.agentName,
      relevance: insight.relevance,
      methodology: insight.methodology,
      date: new Date().toLocaleDateString()
    })),
    metrics: [
      {
        id: "metrics-1",
        name: "Total Insights",
        value: results.insights.length,
        status: "positive",
        description: "Total number of insights found in your data"
      },
      {
        id: "metrics-2",
        name: "Documents Analyzed",
        value: results.documentStats?.totalProcessed || 0,
        status: "positive",
        description: "Number of documents processed in this analysis"
      },
      {
        id: "metrics-3",
        name: "Document Chunks",
        value: results.documentStats?.totalChunks || 0,
        status: "neutral",
        description: "Number of text chunks created for analysis"
      }
    ],
    categories: Object.keys(results.agentResults).map(agentId => ({
      id: `cat-${agentId}`,
      name: agentId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      count: results.agentResults[agentId].length
    })),
    trends: [],
    thematicClusters: []
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
            <div className="flex items-center mb-6">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="mr-2 h-8 w-8"
              >
                <Link to={`/project/${projectId}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    Analysis Results
                  </h1>
                  <StatusBadge status="completed" size="lg" />
                </div>
              </div>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-primary mr-2" />
                  <CardTitle>Document Processing Summary</CardTitle>
                </div>
                <CardDescription>
                  Overview of the documents processed in this analysis run.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  <Card className="border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-500" />
                        Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{results.documentStats?.totalProcessed || 0}</div>
                      <p className="text-sm text-muted-foreground">Total documents analyzed</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Database className="mr-2 h-4 w-4 text-amber-500" />
                        Chunks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{results.documentStats?.totalChunks || 0}</div>
                      <p className="text-sm text-muted-foreground">Text segments processed</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Lightbulb className="mr-2 h-4 w-4 text-green-500" />
                        Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{results.insights.length}</div>
                      <p className="text-sm text-muted-foreground">Total insights found</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-primary mr-2" />
                  <CardTitle>AI Analysis by Methodology</CardTitle>
                </div>
                <CardDescription>
                  Results organized by agent and methodology type.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(results.agentResults).map(([agentId, agentInsights]) => (
                    <Card key={agentId} className="border border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center">
                          <Brain className="mr-2 h-4 w-4" />
                          {agentId.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')} Agent
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Badge variant="outline" className="mr-2">{agentInsights.length} insights</Badge>
                          <Badge variant="secondary">
                            {agentId.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')} Methodology
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {agentInsights.map(insight => (
                            <li key={insight.id} className="text-sm border-l-2 border-primary/50 pl-3 py-1">
                              {insight.text}
                              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                <span className="font-medium mr-1">Confidence:</span> 
                                {Math.round(insight.confidence * 100)}%
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Separator className="mb-8" />
            
            <Tabs defaultValue="insights">
              <TabsList className="mb-8 bg-secondary/50">
                <TabsTrigger value="insights" className="flex">
                  <Brain className="h-4 w-4 mr-2" />
                  Key Insights
                </TabsTrigger>
                <TabsTrigger value="visualization" className="flex">
                  <BarChart className="h-4 w-4 mr-2" />
                  Visualizations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="insights" className="m-0">
                <InsightsTab insights={insightsData} />
              </TabsContent>
              
              <TabsContent value="visualization" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Visualizations</CardTitle>
                    <CardDescription>
                      Visual representations of the analysis results.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center py-16">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="font-medium">Detailed Visualizations</p>
                        <p className="text-sm text-muted-foreground mt-2 mb-6">
                          View comprehensive visualizations on the insights dashboard
                        </p>
                        <Button asChild>
                          <Link to={`/project-insights/${projectId}`}>
                            <BarChart className="mr-2 h-4 w-4" />
                            Open Insights Dashboard
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end">
              <Button asChild>
                <Link to={`/project-insights/${projectId}`}>
                  <BarChart className="mr-2 h-4 w-4" />
                  View Full Insights Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default AnalysisResults;
