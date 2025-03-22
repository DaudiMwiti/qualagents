
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analysisService } from "@/services/analysisService";
import { useNavigate } from "react-router-dom";
import { Play, Loader2 } from "lucide-react";

interface RunAnalysisButtonProps {
  projectId: string;
  agentIds: string[];
  documentCount: number;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

const RunAnalysisButton = ({
  projectId,
  agentIds,
  documentCount,
  className,
  variant = "default",
  size = "default",
  showLabel = true
}: RunAnalysisButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleRunAnalysis = async () => {
    if (documentCount === 0) {
      toast({
        variant: "destructive",
        title: "No documents to analyze",
        description: "Please upload at least one document before running analysis."
      });
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
      toast({
        title: "Starting analysis",
        description: "Preparing your documents for analysis..."
      });
      
      const batchId = await analysisService.startAnalysis({
        projectId,
        agentIds
      });
      
      // Navigate to the results page
      navigate(`/project/${projectId}/results/${batchId}`);
    } catch (error) {
      console.error("Error starting analysis:", error);
      toast({
        variant: "destructive",
        title: "Error starting analysis",
        description: "There was a problem starting the analysis. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleRunAnalysis}
      disabled={isLoading || documentCount === 0}
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
