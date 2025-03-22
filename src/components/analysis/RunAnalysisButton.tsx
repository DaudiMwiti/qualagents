
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analysisService } from "@/services/analysisService";
import { useNavigate } from "react-router-dom";
import { Play, Loader2 } from "lucide-react";
import { toast as sonnerToast } from "sonner"; 

interface RunAnalysisButtonProps {
  projectId: string;
  agentIds: string[];
  documentCount?: number;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

const RunAnalysisButton = ({
  projectId,
  agentIds,
  documentCount: propDocumentCount,
  className,
  variant = "default",
  size = "default",
  showLabel = true
}: RunAnalysisButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actualDocumentCount, setActualDocumentCount] = useState(propDocumentCount || 0);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check for documents in localStorage if none provided via props
  useEffect(() => {
    if (!projectId) return;
    
    if (propDocumentCount === undefined || propDocumentCount === 0) {
      try {
        const documentData = localStorage.getItem(`project_${projectId}_documents`);
        if (documentData) {
          const data = JSON.parse(documentData);
          if (data && data.count) {
            setActualDocumentCount(data.count);
          }
        }
      } catch (e) {
        console.error("Error checking document count:", e);
      }
    } else {
      setActualDocumentCount(propDocumentCount);
    }
  }, [projectId, propDocumentCount]);
  
  const handleRunAnalysis = async () => {
    if (!projectId) {
      toast({
        variant: "destructive",
        title: "Project ID missing",
        description: "Cannot run analysis without a project ID."
      });
      return;
    }
    
    if (actualDocumentCount === 0) {
      toast({
        variant: "destructive",
        title: "No documents to analyze",
        description: "Please upload at least one document before running analysis."
      });
      
      // Direct the user to the upload page
      navigate(`/data-upload/${projectId}`);
      return;
    }
    
    if (agentIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No agents selected",
        description: "Please select at least one agent before running analysis."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use sonner for in-process notifications that won't pile up
      sonnerToast.loading("Starting analysis...", {
        description: "Preparing your documents for analysis",
        id: "analysis-start"
      });
      
      const batchId = await analysisService.startAnalysis({
        projectId,
        agentIds
      });
      
      // Dismiss the loading toast and show success
      sonnerToast.success("Analysis started", {
        description: "Your analysis is running in the background",
        id: "analysis-start"
      });
      
      // Navigate to the results page
      navigate(`/project/${projectId}/results/${batchId}`);
    } catch (error) {
      console.error("Error starting analysis:", error);
      
      // Dismiss the loading toast and show error
      sonnerToast.error("Error starting analysis", {
        description: error instanceof Error ? error.message : "There was a problem starting the analysis. Please try again.",
        id: "analysis-start"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleRunAnalysis}
      disabled={isLoading || (actualDocumentCount === 0)}
      variant={variant}
      size={size}
      className={`${className} relative overflow-hidden group`}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Play className={`${showLabel ? "mr-2" : ""} h-4 w-4`} />
      )}
      {showLabel && (
        <span>Run Analysis</span>
      )}
      <span className="absolute inset-0 bg-primary/10 w-0 group-hover:w-full transition-all duration-300 -z-10 rounded-md"></span>
    </Button>
  );
};

export default RunAnalysisButton;
