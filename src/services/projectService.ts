
// Mock implementation of project service for demo purposes

// Types for projects
export interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  methodologies: string[];
  collaborators: number;
  documents: number;
  status: 'draft' | 'in-progress' | 'completed';
}

export interface ProjectCollaborator {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  dateAdded: string;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "Patient Experience Analysis",
    description: "Investigating patient narratives about telehealth experiences during the pandemic.",
    date: "June 2, 2023",
    methodologies: ["Grounded Theory", "Phenomenology"],
    collaborators: 2,
    documents: 8,
    status: "in-progress",
  },
  {
    id: "proj-2",
    title: "Social Media Discourse Study",
    description: "Analyzing patterns in online discussion forums about climate change.",
    date: "August 15, 2023",
    methodologies: ["Discourse Analysis", "Narrative Analysis"],
    collaborators: 0,
    documents: 3,
    status: "draft",
  },
  {
    id: "proj-3",
    title: "Educator Interviews",
    description: "Examining teacher perspectives on remote learning challenges and solutions.",
    date: "October 3, 2023",
    methodologies: ["Phenomenology"],
    collaborators: 3,
    documents: 12,
    status: "in-progress",
  },
  {
    id: "proj-4",
    title: "Product Feedback Analysis",
    description: "Synthesizing user feedback from multiple sources for product improvement.",
    date: "December 10, 2023",
    methodologies: ["Grounded Theory"],
    collaborators: 1,
    documents: 15,
    status: "completed",
  },
  {
    id: "proj-5",
    title: "Corporate Culture Study",
    description: "Exploring narratives around work-from-home policies in different organizations.",
    date: "January 22, 2024",
    methodologies: ["Narrative Analysis", "Critical Discourse"],
    collaborators: 2,
    documents: 7,
    status: "in-progress",
  },
];

// Mock collaborators
const mockCollaborators: Record<string, ProjectCollaborator[]> = {
  "proj-1": [
    {
      id: "collab-1",
      email: "jane.doe@example.com",
      name: "Jane Doe",
      dateAdded: "May 15, 2023"
    },
    {
      id: "collab-2",
      email: "john.smith@example.com",
      name: "John Smith",
      dateAdded: "May 20, 2023"
    }
  ],
  "proj-3": [
    {
      id: "collab-3",
      email: "alex.wong@example.com",
      name: "Alex Wong",
      dateAdded: "September 10, 2023"
    },
    {
      id: "collab-4",
      email: "sarah.johnson@example.com",
      name: "Sarah Johnson",
      dateAdded: "September 15, 2023"
    },
    {
      id: "collab-5",
      email: "mike.wilson@example.com",
      name: "Mike Wilson",
      dateAdded: "September 20, 2023"
    }
  ],
  "proj-4": [
    {
      id: "collab-6",
      email: "lisa.chen@example.com",
      name: "Lisa Chen",
      dateAdded: "November 5, 2023"
    }
  ],
  "proj-5": [
    {
      id: "collab-7",
      email: "robert.kim@example.com",
      name: "Robert Kim",
      dateAdded: "January 10, 2024"
    },
    {
      id: "collab-8",
      email: "emily.davis@example.com",
      name: "Emily Davis",
      dateAdded: "January 15, 2024"
    }
  ]
};

// In a real app, this would be in a database
let projects = [...mockProjects];
let collaborators = {...mockCollaborators};

class ProjectService {
  // Get all projects
  getProjects(): Project[] {
    return projects;
  }
  
  // Get a project by ID
  getProject(id: string): Project | undefined {
    return projects.find(project => project.id === id);
  }
  
  // Create a new project
  createProject(project: Omit<Project, 'id'>): Project {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    
    projects = [newProject, ...projects];
    return newProject;
  }
  
  // Update an existing project
  updateProject(projectId: string, updates: Partial<Project>): Project | undefined {
    const index = projects.findIndex(p => p.id === projectId);
    
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      return projects[index];
    }
    
    return undefined;
  }
  
  // Delete a project
  deleteProject(projectId: string): boolean {
    const initialLength = projects.length;
    projects = projects.filter(p => p.id !== projectId);
    return projects.length < initialLength;
  }

  // Get project collaborators
  async getProjectCollaborators(projectId: string): Promise<ProjectCollaborator[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return collaborators[projectId] || [];
  }

  // Add a collaborator to a project
  async addProjectCollaborator(projectId: string, email: string): Promise<ProjectCollaborator> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCollaborator: ProjectCollaborator = {
      id: `collab-${Date.now()}`,
      email,
      dateAdded: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    if (!collaborators[projectId]) {
      collaborators[projectId] = [];
    }
    
    collaborators[projectId].push(newCollaborator);
    
    // Update the collaborator count in the project
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].collaborators += 1;
    }
    
    return newCollaborator;
  }

  // Remove a collaborator from a project
  async removeProjectCollaborator(projectId: string, collaboratorId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!collaborators[projectId]) {
      return false;
    }
    
    const initialLength = collaborators[projectId].length;
    collaborators[projectId] = collaborators[projectId].filter(c => c.id !== collaboratorId);
    
    const removed = collaborators[projectId].length < initialLength;
    
    // Update the collaborator count in the project if removal was successful
    if (removed) {
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        projects[projectIndex].collaborators -= 1;
      }
    }
    
    return removed;
  }
}

export const projectService = new ProjectService();
