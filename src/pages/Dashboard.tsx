import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Plus, Search } from "lucide-react";
import { projectService, Project } from "@/services/projectService";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [sortOption, setSortOption] = useState("recent");
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load projects from service
    setProjects(projectService.getProjects());
  }, []);
  
  useEffect(() => {
    // Filter projects based on search term
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.methodologies.some((m) =>
          m.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    
    // Sort projects based on selection
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "name") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "collaborators") {
        return b.collaborators - a.collaborators;
      }
      return 0;
    });
    
    setFilteredProjects(sorted);
  }, [searchTerm, sortOption, projects]);

  return (
    <PageTransition>
      <Navbar />
      
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-semibold">Your Research Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage and explore your qualitative research projects
              </p>
            </div>
            
            <Button asChild className="mt-4 md:mt-0 rounded-full">
              <Link to="/project/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </motion.div>
          
          <Tabs defaultValue="all" className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="shared">Shared with me</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                
                <Select
                  value={sortOption}
                  onValueChange={(value) => setSortOption(value)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="collaborators">Collaborators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              {filteredProjects.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  message={
                    searchTerm
                      ? `No projects found matching "${searchTerm}"`
                      : "You don't have any projects yet"
                  }
                  searchTerm={searchTerm}
                  onClearSearch={() => setSearchTerm("")}
                />
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="m-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.slice(0, 3).map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="shared" className="m-0">
              <EmptyState
                message="No shared projects yet"
                description="Projects shared with you will appear here"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

type EmptyStateProps = {
  message: string;
  description?: string;
  searchTerm?: string;
  onClearSearch?: () => void;
};

const EmptyState = ({
  message,
  description,
  searchTerm,
  onClearSearch,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4 bg-secondary/20 rounded-lg border border-border/50"
    >
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2 text-center">{message}</h3>
      {description && (
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {description}
        </p>
      )}
      
      {searchTerm ? (
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      ) : (
        <Button asChild>
          <Link to="/project/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      )}
    </motion.div>
  );
};

export default Dashboard;
