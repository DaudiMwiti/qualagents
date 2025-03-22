
import React from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Project } from "@/services/projectService";
import { ExportOptions } from "./ExportOptions";
import { ProjectInsights } from "@/services/insightsService";

interface ProjectHeaderProps {
  project: Project;
  insights: ProjectInsights;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, insights }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="mr-2 h-8 w-8"
        >
          <Link to={`/project/${project.id}`}>
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
      
      <ExportOptions project={project} insights={insights} />
    </div>
  );
};
