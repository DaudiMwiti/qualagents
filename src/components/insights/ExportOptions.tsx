
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, FileText, BookOpen, Table as TableIcon, FileJson } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/services/projectService";
import { ProjectInsights } from "@/services/insightsService";
import { exportAsPdf, exportAsMarkdown, exportAsCsv, exportAsJson } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  project: Project;
  insights: ProjectInsights;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ project, insights }) => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

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

  return (
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
  );
};
