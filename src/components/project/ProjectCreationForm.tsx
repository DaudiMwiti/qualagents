
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { projectService } from "@/services/projectService";

const methodologyOptions = [
  "Grounded Theory",
  "Phenomenology",
  "Narrative Analysis",
  "Discourse Analysis",
  "Case Study",
  "Ethnography",
  "Content Analysis",
  "Thematic Analysis",
  "Critical Discourse",
  "Action Research",
];

const ProjectCreationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [methodologies, setMethodologies] = useState<string[]>([]);
  const [selectedMethodology, setSelectedMethodology] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddMethodology = () => {
    if (selectedMethodology && !methodologies.includes(selectedMethodology)) {
      setMethodologies([...methodologies, selectedMethodology]);
      setSelectedMethodology("");
    }
  };
  
  const handleRemoveMethodology = (methodology: string) => {
    setMethodologies(methodologies.filter(m => m !== methodology));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a project title",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create a new project using the service
    try {
      const newProject = projectService.createProject({
        title,
        description,
        methodologies,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        collaborators: 0,
        documents: 0,
        status: "draft",
      });
      
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      });
      
      // Navigate to the project view page
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your research project"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Research Methodologies</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {methodologies.map((methodology) => (
                <Badge key={methodology} variant="secondary" className="py-1">
                  {methodology}
                  <button
                    type="button"
                    className="ml-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveMethodology(methodology)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {methodologies.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No methodologies selected
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Select
                value={selectedMethodology}
                onValueChange={setSelectedMethodology}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select methodology" />
                </SelectTrigger>
                <SelectContent>
                  {methodologyOptions.map((methodology) => (
                    <SelectItem 
                      key={methodology} 
                      value={methodology}
                      disabled={methodologies.includes(methodology)}
                    >
                      {methodology}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMethodology}
                disabled={!selectedMethodology}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProjectCreationForm;
