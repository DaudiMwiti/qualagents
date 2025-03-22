
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Edit,
  FileText,
  MoreHorizontal,
  Trash,
  Upload,
  Users,
  BarChart,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/services/projectService";

const ProjectCard = ({
  id,
  title,
  description,
  date,
  methodologies,
  collaborators,
  documents,
  status,
}: Project) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="pt-6 flex-1">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/project/${id}`} className="hover:underline">
              <h3 className="font-medium line-clamp-1">{title}</h3>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/project/${id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/data-upload/${id}`}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Data
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/project-insights/${id}`}>
                    <BarChart className="mr-2 h-4 w-4" /> View Insights
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-1.5 mb-4">
            {methodologies.slice(0, 2).map((methodology) => (
              <Badge key={methodology} variant="secondary" className="font-normal">
                {methodology}
              </Badge>
            ))}
            {methodologies.length > 2 && (
              <Badge variant="outline" className="font-normal">
                +{methodologies.length - 2} more
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              {date}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {status === "in-progress"
                ? "In Progress"
                : status === "completed"
                ? "Completed"
                : "Draft"}
            </div>
            <div className="flex items-center text-muted-foreground">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              {documents} Documents
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              {collaborators} Collaborators
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4 justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to={`/project/${id}`}>View Project</Link>
          </Button>
          <Button asChild size="sm">
            <Link to={`/project-insights/${id}`}>
              Insights
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
