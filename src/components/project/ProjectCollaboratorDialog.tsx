
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, UserPlus, Users, Mail, Trash2 } from "lucide-react";
import { projectService } from "@/services/projectService";

interface Collaborator {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  dateAdded: string;
}

interface ProjectCollaboratorDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectCollaboratorDialog = ({
  projectId,
  open,
  onOpenChange,
}: ProjectCollaboratorDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch collaborators when dialog opens
  useEffect(() => {
    if (open) {
      loadCollaborators();
    }
  }, [open, projectId]);

  const loadCollaborators = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjectCollaborators(projectId);
      setCollaborators(data || []);
    } catch (error) {
      console.error("Error loading collaborators:", error);
      toast({
        title: "Error loading collaborators",
        description: "Failed to load project collaborators",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setInviting(true);
    
    try {
      await projectService.addProjectCollaborator(projectId, email);
      setEmail("");
      toast({
        title: "Invitation sent",
        description: `${email} has been invited to collaborate on this project`,
      });
      loadCollaborators();
    } catch (error) {
      console.error("Error inviting collaborator:", error);
      toast({
        title: "Invitation failed",
        description: "Failed to invite collaborator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string, email: string) => {
    try {
      await projectService.removeProjectCollaborator(projectId, collaboratorId);
      toast({
        title: "Collaborator removed",
        description: `${email} has been removed from this project`,
      });
      loadCollaborators();
    } catch (error) {
      console.error("Error removing collaborator:", error);
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Project Collaborators
          </DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="flex items-end gap-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email">Email address</Label>
            <div className="flex items-center border rounded-md pl-3 bg-background">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder="colleague@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 flex-1"
              />
            </div>
          </div>
          <Button type="submit" disabled={inviting} className="shrink-0">
            {inviting ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Inviting...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </>
            )}
          </Button>
        </form>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Current Collaborators</h4>
          
          {loading ? (
            <div className="text-center py-4">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent inline-block mr-2" />
              Loading collaborators...
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No collaborators yet
            </div>
          ) : (
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between px-3 py-2 border rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      {collaborator.avatarUrl ? (
                        <img 
                          src={collaborator.avatarUrl} 
                          alt={collaborator.name || collaborator.email}
                          className="h-8 w-8 rounded-full" 
                        />
                      ) : (
                        <span className="text-secondary-foreground text-xs font-medium">
                          {collaborator.email.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium line-clamp-1">
                        {collaborator.name || collaborator.email}
                      </span>
                      {collaborator.name && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {collaborator.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveCollaborator(collaborator.id, collaborator.email)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCollaboratorDialog;
