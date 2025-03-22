
import axios from 'axios';

// Get the backend URL from environment (default to localhost for development)
const API_BASE_URL = process.env.LANGGRAPH_API_URL || 'http://localhost:8000';

interface RunAnalysisRequest {
  projectId: string;
  userId: string;
  agentIds: string[];
}

interface RunAnalysisResponse {
  batchId: string;
  insights: any[];
  summary: string;
}

export const runLangGraphAnalysis = async (
  request: RunAnalysisRequest
): Promise<RunAnalysisResponse> => {
  try {
    // In development, let's support a fallback to the simulated data
    if (process.env.NODE_ENV === 'development' && !process.env.USE_LANGGRAPH_BACKEND) {
      console.log('Using simulated LangGraph response (backend not connected)');
      // Return a simulated response after a short delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        batchId: `batch-${Math.random().toString(36).substring(2, 15)}`,
        insights: [
          {
            id: 'lg-insight-1',
            text: 'Users frequently mentioned difficulties with the navigation interface, particularly on mobile devices.',
            relevance: 92,
            methodology: 'Grounded Theory',
            agentId: 'grounded-theory',
            agentName: 'Grounded Theory Agent'
          },
          {
            id: 'lg-insight-2',
            text: 'Significant gender disparity in reporting technical issues, with women more likely to articulate specific interface problems.',
            relevance: 85,
            methodology: 'Feminist Theory',
            agentId: 'feminist-theory',
            agentName: 'Feminist Theory Agent'
          },
          {
            id: 'lg-insight-3',
            text: 'Documentation contains technical jargon that creates barriers for non-expert users.',
            relevance: 78,
            methodology: 'Critical Analysis',
            agentId: 'bias-identification',
            agentName: 'Bias Identification Agent'
          }
        ],
        summary: 'Analysis reveals significant usability challenges with the navigation interface, particularly on mobile devices. Gender disparities exist in how technical issues are reported, with women providing more specific details about interface problems. The documentation uses technical jargon that creates barriers for non-expert users.'
      };
    }

    console.log(`Connecting to LangGraph backend at: ${API_BASE_URL}`);

    // Make the actual API call to the FastAPI backend
    const response = await axios.post<RunAnalysisResponse>(
      `${API_BASE_URL}/run-analysis`,
      {
        project_id: request.projectId,
        user_id: request.userId,
        agent_ids: request.agentIds
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error running LangGraph analysis:', error);
    throw new Error('Failed to run analysis. The LangGraph backend may not be running.');
  }
};
