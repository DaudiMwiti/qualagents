
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { scaleOnHover } from "@/lib/animations";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  methodologies: string[];
  collaborators: number;
};

const ProjectCard = ({
  id,
  title,
  description,
  date,
  methodologies,
  collaborators,
}: ProjectCardProps) => {
  return (
    <motion.div {...scaleOnHover}>
      <Card className="h-full overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-soft">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Link to={`/project/${id}`}>
              <CardTitle className="text-xl hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {methodologies.map((methodology) => (
              <Badge key={methodology} variant="secondary" className="font-normal">
                {methodology}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/40 text-sm text-muted-foreground py-3">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            {date}
          </div>
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            {collaborators > 0 ? `${collaborators} collaborators` : "No collaborators"}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
