
// Insights service for handling analysis results

// Types for insights data
export interface InsightCategory {
  id: string;
  name: string;
  count: number;
  description?: string;
}

export interface InsightTrend {
  date: string;
  value: number;
  category: string;
}

export interface InsightMetric {
  id: string;
  name: string;
  value: number;
  change?: number;
  status?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

export interface ThematicCluster {
  id: string;
  name: string;
  value: number;
  children?: ThematicCluster[];
}

export interface InsightSummary {
  id: string;
  text: string;
  agentId: string;
  agentName: string;
  relevance: number;
  methodology: string;
  date: string;
}

export interface ProjectInsights {
  metrics: InsightMetric[];
  categories: InsightCategory[];
  trends: InsightTrend[];
  thematicClusters: ThematicCluster[];
  topInsights: InsightSummary[];
}

// Mock data for demonstration
const mockInsightsData: Record<string, ProjectInsights> = {
  "proj-1": {
    metrics: [
      {
        id: "metric-1",
        name: "Total Insights",
        value: 342,
        change: 12,
        status: "positive",
        description: "Total number of insights generated by all agents"
      },
      {
        id: "metric-2",
        name: "Key Themes",
        value: 24,
        change: 5,
        status: "positive",
        description: "Distinct thematic categories identified"
      },
      {
        id: "metric-3",
        name: "Sentiment Score",
        value: 78,
        change: -2,
        status: "negative",
        description: "Average sentiment score (0-100)"
      },
      {
        id: "metric-4",
        name: "Confidence",
        value: 92,
        change: 3,
        status: "positive",
        description: "Average agent confidence in insights"
      }
    ],
    categories: [
      { id: "cat-1", name: "Usability Concerns", count: 87 },
      { id: "cat-2", name: "Technical Issues", count: 64 },
      { id: "cat-3", name: "Positive Experiences", count: 112 },
      { id: "cat-4", name: "Feature Requests", count: 45 },
      { id: "cat-5", name: "Accessibility Needs", count: 34 }
    ],
    trends: [
      { date: "Jan", value: 30, category: "Usability Concerns" },
      { date: "Feb", value: 42, category: "Usability Concerns" },
      { date: "Mar", value: 65, category: "Usability Concerns" },
      { date: "Apr", value: 85, category: "Usability Concerns" },
      { date: "May", value: 87, category: "Usability Concerns" },
      
      { date: "Jan", value: 25, category: "Technical Issues" },
      { date: "Feb", value: 38, category: "Technical Issues" },
      { date: "Mar", value: 55, category: "Technical Issues" },
      { date: "Apr", value: 62, category: "Technical Issues" },
      { date: "May", value: 64, category: "Technical Issues" },
      
      { date: "Jan", value: 45, category: "Positive Experiences" },
      { date: "Feb", value: 56, category: "Positive Experiences" },
      { date: "Mar", value: 75, category: "Positive Experiences" },
      { date: "Apr", value: 98, category: "Positive Experiences" },
      { date: "May", value: 112, category: "Positive Experiences" },
      
      { date: "Jan", value: 15, category: "Feature Requests" },
      { date: "Feb", value: 22, category: "Feature Requests" },
      { date: "Mar", value: 35, category: "Feature Requests" },
      { date: "Apr", value: 42, category: "Feature Requests" },
      { date: "May", value: 45, category: "Feature Requests" },
      
      { date: "Jan", value: 12, category: "Accessibility Needs" },
      { date: "Feb", value: 18, category: "Accessibility Needs" },
      { date: "Mar", value: 24, category: "Accessibility Needs" },
      { date: "Apr", value: 32, category: "Accessibility Needs" },
      { date: "May", value: 34, category: "Accessibility Needs" }
    ],
    thematicClusters: [
      {
        id: "theme-1",
        name: "User Experience",
        value: 200,
        children: [
          { id: "subtheme-1-1", name: "Navigation", value: 75 },
          { id: "subtheme-1-2", name: "Visual Design", value: 50 },
          { id: "subtheme-1-3", name: "Performance", value: 75 }
        ]
      },
      {
        id: "theme-2",
        name: "Content Quality",
        value: 150,
        children: [
          { id: "subtheme-2-1", name: "Relevance", value: 60 },
          { id: "subtheme-2-2", name: "Clarity", value: 45 },
          { id: "subtheme-2-3", name: "Completeness", value: 45 }
        ]
      },
      {
        id: "theme-3",
        name: "Technical Aspects",
        value: 100,
        children: [
          { id: "subtheme-3-1", name: "Bugs", value: 40 },
          { id: "subtheme-3-2", name: "Integration", value: 30 },
          { id: "subtheme-3-3", name: "Compatibility", value: 30 }
        ]
      }
    ],
    topInsights: [
      {
        id: "insight-1",
        text: "Patients consistently report difficulties with the video call interface, particularly when trying to share documents during telehealth consultations.",
        agentId: "agent-1",
        agentName: "Grounded Theory Agent",
        relevance: 98,
        methodology: "Grounded Theory",
        date: "May 15, 2023"
      },
      {
        id: "insight-2",
        text: "Older patients (65+) express significantly more satisfaction with telehealth services compared to in-person visits when considering travel time and convenience factors.",
        agentId: "agent-2",
        agentName: "Feminist Theory Agent",
        relevance: 95,
        methodology: "Feminist Theory",
        date: "May 12, 2023"
      },
      {
        id: "insight-3",
        text: "Healthcare providers report spending an average of 10 additional minutes per telehealth session on technical support rather than patient care.",
        agentId: "agent-3",
        agentName: "Bias Identification Agent",
        relevance: 92,
        methodology: "Critical Analysis",
        date: "May 10, 2023"
      },
      {
        id: "insight-4",
        text: "Patients with limited English proficiency face disproportionate challenges in navigating telehealth platforms, indicating potential accessibility issues.",
        agentId: "agent-2",
        agentName: "Feminist Theory Agent",
        relevance: 90,
        methodology: "Feminist Theory",
        date: "May 8, 2023"
      },
      {
        id: "insight-5",
        text: "There's a strong correlation between patients who report positive telehealth experiences and those who had received an orientation to the platform prior to their first appointment.",
        agentId: "agent-1",
        agentName: "Grounded Theory Agent",
        relevance: 88,
        methodology: "Grounded Theory",
        date: "May 5, 2023"
      }
    ]
  },
  "proj-2": {
    metrics: [
      {
        id: "metric-1",
        name: "Total Insights",
        value: 218,
        change: 8,
        status: "positive",
        description: "Total number of insights generated by all agents"
      },
      {
        id: "metric-2",
        name: "Key Themes",
        value: 18,
        change: 2,
        status: "positive",
        description: "Distinct thematic categories identified"
      },
      {
        id: "metric-3",
        name: "Sentiment Score",
        value: 45,
        change: -15,
        status: "negative",
        description: "Average sentiment score (0-100)"
      },
      {
        id: "metric-4",
        name: "Confidence",
        value: 87,
        change: 4,
        status: "positive",
        description: "Average agent confidence in insights"
      }
    ],
    categories: [
      { id: "cat-1", name: "Environmental Concern", count: 92 },
      { id: "cat-2", name: "Policy Discussions", count: 48 },
      { id: "cat-3", name: "Scientific Facts", count: 35 },
      { id: "cat-4", name: "Economic Impact", count: 28 },
      { id: "cat-5", name: "Skepticism", count: 15 }
    ],
    trends: [
      { date: "Jan", value: 40, category: "Environmental Concern" },
      { date: "Feb", value: 55, category: "Environmental Concern" },
      { date: "Mar", value: 75, category: "Environmental Concern" },
      { date: "Apr", value: 88, category: "Environmental Concern" },
      { date: "May", value: 92, category: "Environmental Concern" },
      
      { date: "Jan", value: 20, category: "Policy Discussions" },
      { date: "Feb", value: 28, category: "Policy Discussions" },
      { date: "Mar", value: 35, category: "Policy Discussions" },
      { date: "Apr", value: 42, category: "Policy Discussions" },
      { date: "May", value: 48, category: "Policy Discussions" },
      
      { date: "Jan", value: 15, category: "Scientific Facts" },
      { date: "Feb", value: 22, category: "Scientific Facts" },
      { date: "Mar", value: 28, category: "Scientific Facts" },
      { date: "Apr", value: 32, category: "Scientific Facts" },
      { date: "May", value: 35, category: "Scientific Facts" }
    ],
    thematicClusters: [
      {
        id: "theme-1",
        name: "Climate Action",
        value: 120,
        children: [
          { id: "subtheme-1-1", name: "Individual Actions", value: 45 },
          { id: "subtheme-1-2", name: "Community Initiatives", value: 35 },
          { id: "subtheme-1-3", name: "Corporate Responsibility", value: 40 }
        ]
      },
      {
        id: "theme-2",
        name: "Policy Framework",
        value: 80,
        children: [
          { id: "subtheme-2-1", name: "International Agreements", value: 30 },
          { id: "subtheme-2-2", name: "National Legislation", value: 25 },
          { id: "subtheme-2-3", name: "Local Regulations", value: 25 }
        ]
      },
      {
        id: "theme-3",
        name: "Economic Considerations",
        value: 60,
        children: [
          { id: "subtheme-3-1", name: "Job Impact", value: 25 },
          { id: "subtheme-3-2", name: "Investment Opportunities", value: 20 },
          { id: "subtheme-3-3", name: "Cost Analysis", value: 15 }
        ]
      }
    ],
    topInsights: [
      {
        id: "insight-1",
        text: "Online discussions frequently associate climate change solutions with personal responsibility, overshadowing conversations about systemic and corporate accountability.",
        agentId: "agent-1",
        agentName: "Discourse Analysis Agent",
        relevance: 96,
        methodology: "Discourse Analysis",
        date: "August 10, 2023"
      },
      {
        id: "insight-2",
        text: "There is a significant correlation between users' skepticism of climate science and their concerns about economic impacts of environmental regulations.",
        agentId: "agent-2",
        agentName: "Narrative Analysis Agent",
        relevance: 93,
        methodology: "Narrative Analysis",
        date: "August 8, 2023"
      },
      {
        id: "insight-3",
        text: "Discussion participants with scientific backgrounds tend to use more emotional language when discussing climate impacts than when discussing potential solutions.",
        agentId: "agent-3",
        agentName: "Critical Discourse Agent",
        relevance: 88,
        methodology: "Critical Discourse",
        date: "August 5, 2023"
      }
    ]
  }
};

// For other mock projects, create simplified data structures
for (let i = 3; i <= 5; i++) {
  mockInsightsData[`proj-${i}`] = {
    metrics: [
      {
        id: "metric-1",
        name: "Total Insights",
        value: Math.floor(Math.random() * 300) + 100,
        change: Math.floor(Math.random() * 20) - 5,
        status: Math.random() > 0.3 ? "positive" : "negative",
        description: "Total number of insights generated by all agents"
      },
      {
        id: "metric-2",
        name: "Key Themes",
        value: Math.floor(Math.random() * 30) + 5,
        change: Math.floor(Math.random() * 10) - 2,
        status: Math.random() > 0.3 ? "positive" : "negative",
        description: "Distinct thematic categories identified"
      }
    ],
    categories: [
      { id: "cat-1", name: "Theme A", count: Math.floor(Math.random() * 100) + 20 },
      { id: "cat-2", name: "Theme B", count: Math.floor(Math.random() * 80) + 10 },
      { id: "cat-3", name: "Theme C", count: Math.floor(Math.random() * 60) + 10 }
    ],
    trends: [
      { date: "Jan", value: Math.floor(Math.random() * 40) + 10, category: "Theme A" },
      { date: "Feb", value: Math.floor(Math.random() * 50) + 20, category: "Theme A" },
      { date: "Mar", value: Math.floor(Math.random() * 60) + 30, category: "Theme A" },
      { date: "Apr", value: Math.floor(Math.random() * 70) + 40, category: "Theme A" },
      { date: "May", value: Math.floor(Math.random() * 80) + 50, category: "Theme A" }
    ],
    thematicClusters: [
      {
        id: "theme-1",
        name: "Main Theme",
        value: Math.floor(Math.random() * 100) + 50,
        children: [
          { id: "subtheme-1", name: "Subtheme 1", value: Math.floor(Math.random() * 40) + 10 },
          { id: "subtheme-2", name: "Subtheme 2", value: Math.floor(Math.random() * 30) + 10 }
        ]
      }
    ],
    topInsights: [
      {
        id: `insight-${i}-1`,
        text: "This is a sample insight that would be generated by the AI analysis.",
        agentId: "agent-1",
        agentName: "Analysis Agent",
        relevance: Math.floor(Math.random() * 20) + 80,
        methodology: "Mixed Methods",
        date: "Recent Date"
      }
    ]
  };
}

class InsightsService {
  // Get all insights for a project
  getProjectInsights(projectId: string): ProjectInsights | null {
    return mockInsightsData[projectId] || null;
  }
  
  // Get metrics for a project
  getProjectMetrics(projectId: string): InsightMetric[] {
    return mockInsightsData[projectId]?.metrics || [];
  }
  
  // Get categories for a project
  getProjectCategories(projectId: string): InsightCategory[] {
    return mockInsightsData[projectId]?.categories || [];
  }
  
  // Get trends for a project
  getProjectTrends(projectId: string): InsightTrend[] {
    return mockInsightsData[projectId]?.trends || [];
  }
  
  // Get thematic clusters for a project
  getProjectThematicClusters(projectId: string): ThematicCluster[] {
    return mockInsightsData[projectId]?.thematicClusters || [];
  }
  
  // Get top insights for a project
  getProjectTopInsights(projectId: string): InsightSummary[] {
    return mockInsightsData[projectId]?.topInsights || [];
  }
}

export const insightsService = new InsightsService();
