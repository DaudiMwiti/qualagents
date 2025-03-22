
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

// In a real app, this would be in a database
let projects = [...mockProjects];

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
}

export const projectService = new ProjectService();
