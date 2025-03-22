
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChevronDown, MoreHorizontal, Plus, Search, Share, Trash, UserPlus, Users } from 'lucide-react';
import { getGravatarUrl } from '@/utils/profileUtils';

type Collaborator = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: 'viewer' | 'editor' | 'admin';
  status: 'active' | 'pending';
};

type ProjectCollaboratorsManagementProps = {
  projectId: string;
  isOwner: boolean;
};

const ProjectCollaboratorsManagement = ({ projectId, isOwner }: ProjectCollaboratorsManagementProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor'>('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = useSupabaseClient();

  // Fetch collaborators
  useEffect(() => {
    const fetchCollaborators = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from Supabase
        // For demo, we'll use mock data
        const mockCollaborators: Collaborator[] = [
          {
            id: '1',
            email: 'colleague@example.com',
            name: 'Jane Researcher',
            avatarUrl: getGravatarUrl('colleague@example.com'),
            role: 'editor',
            status: 'active',
          },
          {
            id: '2',
            email: 'team@example.com',
            name: 'Research Team',
            avatarUrl: getGravatarUrl('team@example.com'),
            role: 'viewer',
            status: 'active',
          },
          {
            id: '3',
            email: 'pending@example.com',
            name: 'Pending Collaborator',
            avatarUrl: getGravatarUrl('pending@example.com'),
            role: 'viewer',
            status: 'pending',
          },
        ];
        
        // Simulate delay for loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        setCollaborators(mockCollaborators);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
        toast({
          title: 'Failed to load collaborators',
          description: 'There was an error loading the project collaborators.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollaborators();
  }, [projectId]);

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address to invite.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would send to Supabase
      // For demo, just add to the list
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        email: inviteEmail,
        name: inviteEmail.split('@')[0],
        avatarUrl: getGravatarUrl(inviteEmail),
        role: inviteRole,
        status: 'pending',
      };

      setCollaborators([...collaborators, newCollaborator]);
      setInviteEmail('');
      
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${inviteEmail}.`,
      });
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: 'Failed to send invitation',
        description: 'There was an error sending the invitation.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (collaboratorId: string, newRole: 'viewer' | 'editor' | 'admin') => {
    setIsLoading(true);
    try {
      // Update collaborator role
      setCollaborators(
        collaborators.map(collab => 
          collab.id === collaboratorId ? { ...collab, role: newRole } : collab
        )
      );
      
      toast({
        title: 'Role updated',
        description: 'The collaborator\'s role has been updated.',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Failed to update role',
        description: 'There was an error updating the collaborator\'s role.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    setIsLoading(true);
    try {
      // Remove collaborator
      setCollaborators(
        collaborators.filter(collab => collab.id !== collaboratorId)
      );
      
      toast({
        title: 'Collaborator removed',
        description: 'The collaborator has been removed from the project.',
      });
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: 'Failed to remove collaborator',
        description: 'There was an error removing the collaborator.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCollaborators = collaborators.filter(
    collab => 
      collab.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      collab.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Project Collaborators
        </CardTitle>
        <CardDescription>
          Manage who has access to this project and what they can do
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isOwner && (
          <>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <Input
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select 
                value={inviteRole} 
                onValueChange={(value: 'viewer' | 'editor') => setInviteRole(value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleInvite} 
                disabled={isLoading || !inviteEmail}
                className="whitespace-nowrap"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>
            
            <Separator className="my-4" />
          </>
        )}
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collaborators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="mt-4 space-y-3">
          {filteredCollaborators.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              {searchQuery ? 'No collaborators match your search' : 'No collaborators yet'}
            </div>
          )}
          
          {filteredCollaborators.map((collaborator) => (
            <div 
              key={collaborator.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={collaborator.avatarUrl} />
                  <AvatarFallback>
                    {collaborator.name[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col">
                  <span className="font-medium">{collaborator.name}</span>
                  <span className="text-xs text-muted-foreground">{collaborator.email}</span>
                </div>
                
                {collaborator.status === 'pending' && (
                  <Badge variant="outline" className="ml-2 text-xs">Pending</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    collaborator.role === 'admin' 
                      ? 'default' 
                      : collaborator.role === 'editor' 
                        ? 'secondary' 
                        : 'outline'
                  }
                  className="text-xs"
                >
                  {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                </Badge>
                
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleRoleChange(collaborator.id, 'viewer')}>
                        Set as Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(collaborator.id, 'editor')}>
                        Set as Editor
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          <Share className="mr-2 h-3 w-3" />
          Copy Invite Link
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Options
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Export Collaborator List
            </DropdownMenuItem>
            <DropdownMenuItem>
              Resend All Pending Invites
            </DropdownMenuItem>
            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Remove All Collaborators
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default ProjectCollaboratorsManagement;
